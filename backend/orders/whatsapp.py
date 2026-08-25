"""
Sends automated order-status WhatsApp messages via Meta's WhatsApp
Business Cloud API. Requires a real Meta Business/WhatsApp API setup —
unlike Cashfree's instant test signup, this needs a verified Meta
Business account and an app with the WhatsApp product added
(https://developers.facebook.com/apps -> WhatsApp -> API Setup), which
gives you a temporary access token, a test phone number ID, and a list
of pre-approved test recipient numbers to message during development.

Without WHATSAPP_CLOUD_TOKEN / WHATSAPP_PHONE_NUMBER_ID configured in
backend/.env, this silently no-ops (logs a note) — the click-to-chat
wa.me links elsewhere on the site keep working regardless, since those
don't need this API at all.
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


def send_order_status_whatsapp(order):
    template = STATUS_MESSAGE_TEMPLATES.get(order.status)
    if not template:
        return

    token = getattr(settings, 'WHATSAPP_CLOUD_TOKEN', '')
    phone_number_id = getattr(settings, 'WHATSAPP_PHONE_NUMBER_ID', '')

    if not token or not phone_number_id:
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
        if response.status_code >= 400:
            logger.warning(f"WhatsApp send failed for order {order.order_number}: {response.text}")
    except Exception as e:
        logger.warning(f"WhatsApp send error for order {order.order_number}: {e}")
