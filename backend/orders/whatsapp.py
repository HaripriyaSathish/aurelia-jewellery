"""
Sends automated order-status WhatsApp messages, via either of two
providers (checked in this order):

1. Twilio's WhatsApp API — set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
   TWILIO_WHATSAPP_FROM. Their free Sandbox works instantly with no
   Meta Business verification: sign up at twilio.com, open Messaging
   -> Try it out -> Send a WhatsApp message, and send the shown "join
   <code>" text from your own WhatsApp to their sandbox number to
   receive test messages. Sandbox only messages numbers that joined it.

2. Meta's WhatsApp Business Cloud API directly — set
   WHATSAPP_CLOUD_TOKEN / WHATSAPP_PHONE_NUMBER_ID. Needs a verified
   Meta Business account and an app with the WhatsApp product added
   (https://developers.facebook.com/apps -> WhatsApp -> API Setup).

Without either configured in backend/.env, this silently no-ops (logs
a note) — the click-to-chat wa.me links elsewhere on the site keep
working regardless, since those don't need either API.
"""
import logging
import re

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

STATUS_MESSAGE_TEMPLATES = {
    'PAID': (
        "Hi {name}, your VETRI order {order_number} is confirmed! 🎉\n"
        "Total paid: ₹{total}\n"
        "We'll message you again once it ships."
    ),
    'SHIPPED': (
        "Hi {name}, your VETRI order {order_number} has been shipped and is on its way to you."
    ),
    'OUT_FOR_DELIVERY': (
        "Hi {name}, your VETRI order {order_number} is out for delivery today. Please keep your phone handy."
    ),
    'DELIVERED': (
        "Hi {name}, your VETRI order {order_number} has been delivered. Thank you for shopping with us — "
        "we hope you love it!"
    ),
}


def _format_recipient(phone):
    """Best-effort E.164-ish formatting: strips non-digits, defaults to India (91) for bare 10-digit numbers."""
    digits = re.sub(r'\D', '', phone or '')
    if len(digits) == 10:
        return f"91{digits}"
    return digits


def _send_via_twilio(message, to_number):
    account_sid = settings.TWILIO_ACCOUNT_SID
    auth_token = settings.TWILIO_AUTH_TOKEN
    from_number = settings.TWILIO_WHATSAPP_FROM

    response = requests.post(
        f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json",
        auth=(account_sid, auth_token),
        data={
            "From": from_number if from_number.startswith("whatsapp:") else f"whatsapp:{from_number}",
            "To": f"whatsapp:+{to_number}",
            "Body": message,
        },
        timeout=15,
    )
    return response


def _send_via_meta_cloud_api(message, to_number):
    token = settings.WHATSAPP_CLOUD_TOKEN
    phone_number_id = settings.WHATSAPP_PHONE_NUMBER_ID

    response = requests.post(
        f"https://graph.facebook.com/v20.0/{phone_number_id}/messages",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json={
            "messaging_product": "whatsapp",
            "to": to_number,
            "type": "text",
            "text": {"body": message},
        },
        timeout=15,
    )
    return response


def send_order_status_whatsapp(order):
    template = STATUS_MESSAGE_TEMPLATES.get(order.status)
    if not template:
        return

    use_twilio = bool(settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_WHATSAPP_FROM)
    use_meta = bool(settings.WHATSAPP_CLOUD_TOKEN and settings.WHATSAPP_PHONE_NUMBER_ID)

    if not use_twilio and not use_meta:
        logger.info(
            f"WhatsApp not configured — skipped '{order.status}' notification for order {order.order_number}."
        )
        return

    first_name = (order.customer_name or 'there').split(' ')[0]
    message = template.format(
        name=first_name,
        order_number=order.order_number,
        total=f"{order.total_amount:,.0f}",
    )
    to_number = _format_recipient(order.customer_phone)

    if not to_number:
        logger.warning(f"No usable phone number to WhatsApp order {order.order_number}.")
        return

    try:
        response = _send_via_twilio(message, to_number) if use_twilio else _send_via_meta_cloud_api(message, to_number)
        if response.status_code >= 400:
            logger.warning(f"WhatsApp send failed for order {order.order_number}: {response.text}")
    except Exception as e:
        logger.warning(f"WhatsApp send error for order {order.order_number}: {e}")
