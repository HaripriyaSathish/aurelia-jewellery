"""
Assistant "brain" for the storefront chatbot widget.

Three layers, tried in order:
  1. Deterministic intent handlers for the things customers actually ask
     most: current offers/discounts and order tracking. These never rely
     on an external AI API, so they work even with zero configuration.
  2. A lightweight product search over the catalogue.
  3. An optional call out to the Groq API for open-ended questions,
     grounded with real shop data, if GROQ_API_KEY is configured.
     Without a key, a helpful canned response (with a WhatsApp handoff)
     is returned instead.
"""
import logging
import re

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

ORDER_NUMBER_RE = re.compile(r'\bAUR-\d{6}\b', re.IGNORECASE)
EMAIL_RE = re.compile(r'[\w.+-]+@[\w-]+\.[\w.-]+')
PHONE_RE = re.compile(r'(\+?\d[\d\s-]{7,14}\d)')

OFFER_KEYWORDS = ('offer', 'discount', 'sale', 'deal', 'promo', 'price drop')
TRACK_KEYWORDS = ('track', 'order status', 'where is my order', 'my order', 'delivery status', 'shipment')
WHATSAPP_KEYWORDS = ('whatsapp', 'human', 'agent', 'concierge', 'call', 'talk to someone')
BESTSELLER_KEYWORDS = ('bestseller', 'best seller', 'best-seller', 'popular', 'most loved', 'top pick', 'most sold')


def _whatsapp_link(settings_obj, text):
    from urllib.parse import quote
    number = re.sub(r'[^0-9]', '', settings_obj.whatsapp_number) if settings_obj else ''
    return f"https://wa.me/{number}?text={quote(text)}"


def _get_shop_settings():
    from jewellery.models import ShopSettings
    return ShopSettings.load()


def _offers_reply():
    from jewellery.models import JewelleryProduct
    deals = JewelleryProduct.objects.filter(old_price__isnull=False).order_by('-created_at')[:4]
    if deals:
        lines = [f"• {p.name} — now ₹{p.price:,.0f} (was ₹{p.old_price:,.0f})" for p in deals]
        body = "Here are our current highlighted offers:\n" + "\n".join(lines)
    else:
        body = "We don't have a site-wide sale listed right now, but our concierge often has private pricing available."
    return {
        "reply": body,
        "quick_replies": ["Track my order", "Talk on WhatsApp", "Show bestsellers"],
        "context": {},
    }


def _bestsellers_reply():
    from jewellery.models import JewelleryProduct
    items = JewelleryProduct.objects.filter(is_bestseller=True).order_by('-created_at')[:4]
    if items:
        lines = [f"• {p.name} — ₹{p.price:,.0f} ({p.material})" for p in items]
        body = "Here are our current bestsellers:\n" + "\n".join(lines)
    else:
        body = "We don't have bestsellers flagged just yet — but I can show you our current offers or help you find something specific."
    return {
        "reply": body,
        "quick_replies": ["See current offers", "Track my order", "Talk on WhatsApp"],
        "context": {},
    }


def _product_search_reply(message):
    from jewellery.models import JewelleryProduct
    from django.db.models import Q

    tokens = [t for t in re.findall(r'[a-zA-Z]{4,}', message) if t.lower() not in ('what', 'have', 'looking', 'show', 'want', 'need', 'jewellery', 'jewelry', 'please')]
    if not tokens:
        return None

    q = Q()
    for t in tokens:
        q |= Q(name__icontains=t) | Q(category__name__icontains=t) | Q(material__icontains=t) | Q(description__icontains=t)

    matches = JewelleryProduct.objects.filter(q).distinct()[:4]
    if not matches:
        return None

    lines = [f"• {p.name} — ₹{p.price:,.0f} ({p.material})" for p in matches]
    return {
        "reply": "Here's what I found in our collection:\n" + "\n".join(lines),
        "quick_replies": ["See current offers", "Track my order", "Talk on WhatsApp"],
        "context": {},
    }


def _track_order_reply(message, context):
    from orders.models import Order

    order_match = ORDER_NUMBER_RE.search(message)
    email_match = EMAIL_RE.search(message)
    phone_match = PHONE_RE.search(message)

    order_number = context.get('order_number') or (order_match.group(0).upper() if order_match else None)
    email = context.get('email') or (email_match.group(0) if email_match else None)
    phone = context.get('phone') or (re.sub(r'[\s-]', '', phone_match.group(0)) if phone_match else None)

    if not order_number:
        return {
            "reply": "Sure — please share your order number (it looks like AUR-123456) so I can check its status.",
            "quick_replies": [],
            "context": {"intent": "track_order"},
        }

    if not email and not phone:
        return {
            "reply": f"Got it — order {order_number}. Please also share the email or phone number used at checkout, just to verify it's you.",
            "quick_replies": [],
            "context": {"intent": "track_order", "order_number": order_number},
        }

    qs = Order.objects.filter(order_number__iexact=order_number)
    qs = qs.filter(customer_email__iexact=email) if email else qs.filter(customer_phone=phone)
    order = qs.first()

    if not order:
        return {
            "reply": "I couldn't find a matching order with those details. Please double-check the order number and contact info, or chat with our concierge on WhatsApp.",
            "quick_replies": ["Talk on WhatsApp"],
            "context": {},
        }

    status_label = order.get_status_display()
    reply = (
        f"Order {order.order_number} is currently: {status_label}.\n"
        f"Total: ₹{order.total_amount:,.0f}\n"
        f"Placed on: {order.created_at.strftime('%d %b %Y')}"
    )
    return {
        "reply": reply,
        "quick_replies": ["Talk on WhatsApp", "See current offers"],
        "context": {},
        "order_number": order.order_number,
    }


def _ai_fallback_reply(message):
    settings_obj = _get_shop_settings()
    api_key = getattr(settings, 'GROQ_API_KEY', '')

    if not api_key:
        text = (
            "I'm still learning, and I'm not fully sure about that one. "
            "I can help with current offers, tracking an order, or product questions — "
            "or you can chat directly with our concierge on WhatsApp."
        )
        return {
            "reply": text,
            "quick_replies": ["See current offers", "Track my order", "Talk on WhatsApp"],
            "context": {},
        }

    try:
        from jewellery.models import JewelleryProduct
        sample_products = JewelleryProduct.objects.select_related('category').all()[:8]
        catalogue_summary = "\n".join(
            f"- {p.name} ({p.category.name}): ₹{p.price:,.0f}, {p.material}" for p in sample_products
        )

        system_prompt = (
            f"You are the friendly shopping assistant for {settings_obj.shop_name}, an Indian fine "
            f"jewellery boutique. Tagline: {settings_obj.tagline}. Shop hours: {settings_obj.opening_hours}. "
            f"Address: {settings_obj.address}.\n\n"
            f"A sample of the current catalogue:\n{catalogue_summary}\n\n"
            "Answer briefly and warmly (2-4 sentences max). Only answer questions about this jewellery "
            "store, its products, offers, or order/shipping policy. If asked something unrelated or you "
            "are unsure, politely suggest contacting the boutique on WhatsApp instead of guessing."
        )

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": getattr(settings, 'GROQ_MODEL', 'llama-3.3-70b-versatile'),
                "max_tokens": 300,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message},
                ],
            },
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
        text = data["choices"][0]["message"]["content"].strip()
        text = text or "I'm not sure about that — our concierge on WhatsApp can help further."
    except Exception as e:
        logger.warning(f"Groq chatbot call failed: {e}")
        text = "I'm having trouble reaching my brain right now — please try again, or chat with our concierge on WhatsApp."

    return {
        "reply": text,
        "quick_replies": ["See current offers", "Track my order", "Talk on WhatsApp"],
        "context": {},
    }


def handle_message(message, context=None):
    context = context or {}
    lowered = message.lower().strip()

    if context.get('intent') == 'track_order' or any(k in lowered for k in TRACK_KEYWORDS) or ORDER_NUMBER_RE.search(message):
        return _track_order_reply(message, context)

    if any(k in lowered for k in WHATSAPP_KEYWORDS):
        settings_obj = _get_shop_settings()
        return {
            "reply": "Of course — here is a direct WhatsApp link to our jewellery concierge team.",
            "quick_replies": [],
            "context": {},
            "whatsapp_url": _whatsapp_link(settings_obj, settings_obj.whatsapp_message),
        }

    if any(k in lowered for k in OFFER_KEYWORDS):
        return _offers_reply()

    if any(k in lowered for k in BESTSELLER_KEYWORDS):
        return _bestsellers_reply()

    product_reply = _product_search_reply(message)
    if product_reply:
        return product_reply

    return _ai_fallback_reply(message)
