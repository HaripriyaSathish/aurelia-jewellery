"""
Thin wrapper around the Cashfree Payment Gateway REST API (Orders API,
version 2023-08-01). Defaults to the sandbox/test environment so the
project lead only needs to sign up for a free Cashfree TEST account at
https://merchant.cashfree.com/merchants/signup and paste the Test App ID
and Test Secret Key into backend/.env — no production KYC required to
try the flow end-to-end.
"""
import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

API_VERSION = "2023-08-01"


def _base_url():
    return (
        "https://api.cashfree.com/pg"
        if settings.CASHFREE_ENV == "PRODUCTION"
        else "https://sandbox.cashfree.com/pg"
    )


def _headers():
    return {
        "x-client-id": settings.CASHFREE_APP_ID,
        "x-client-secret": settings.CASHFREE_SECRET_KEY,
        "x-api-version": API_VERSION,
        "Content-Type": "application/json",
    }


class CashfreeError(Exception):
    pass


def create_payment_order(order):
    """
    Registers the local Order with Cashfree and returns the
    payment_session_id the frontend Drop-in checkout needs.
    """
    if not settings.CASHFREE_APP_ID or not settings.CASHFREE_SECRET_KEY:
        raise CashfreeError(
            "Cashfree is not configured. Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY "
            "(test mode credentials) in backend/.env."
        )

    payload = {
        "order_id": order.order_number,
        "order_amount": float(order.total_amount),
        "order_currency": "INR",
        "customer_details": {
            "customer_id": f"cust_{order.pk}",
            "customer_name": order.customer_name,
            "customer_email": order.customer_email,
            "customer_phone": order.customer_phone or "9999999999",
        },
        "order_meta": {
            "return_url": f"{settings.FRONTEND_URL.rstrip('/')}/order-tracking?order={order.order_number}",
        },
    }

    response = requests.post(f"{_base_url()}/orders", json=payload, headers=_headers(), timeout=15)
    data = response.json()

    if response.status_code >= 400:
        logger.warning(f"Cashfree create order failed: {data}")
        raise CashfreeError(data.get("message", "Unable to create Cashfree order."))

    return data


def get_payment_order(cashfree_order_id):
    """Fetches the latest order + payment status from Cashfree."""
    response = requests.get(f"{_base_url()}/orders/{cashfree_order_id}", headers=_headers(), timeout=15)
    data = response.json()

    if response.status_code >= 400:
        logger.warning(f"Cashfree get order failed: {data}")
        raise CashfreeError(data.get("message", "Unable to fetch Cashfree order status."))

    return data


def get_order_payments(cashfree_order_id):
    """
    Fetches the list of payment attempts for an order — used to pull the
    transaction ID (cf_payment_id) and payment method for the successful
    payment, for display on the invoice.
    """
    response = requests.get(f"{_base_url()}/orders/{cashfree_order_id}/payments", headers=_headers(), timeout=15)
    data = response.json()

    if response.status_code >= 400:
        logger.warning(f"Cashfree get payments failed: {data}")
        return []

    return data if isinstance(data, list) else []
