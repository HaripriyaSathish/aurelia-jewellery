import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

def send_contact_emails(enquiry):
    """
    Sends notification email to boutique administrator and
    an elegant confirmation email to the customer.
    """
    # 1. Email to Admin
    admin_subject = f"[AURELIA Inquiry] New message from {enquiry.name}: {enquiry.subject}"
    admin_message = f"""
New Enquiry Received at AURELIA Fine Jewellery Concierge
-------------------------------------------------------
Date: {enquiry.created_at.strftime('%B %d, %Y at %I:%M %p')}
Client Name: {enquiry.name}
Email: {enquiry.email}
Phone: {enquiry.phone}
Subject: {enquiry.subject}

Message:
{enquiry.message}

-------------------------------------------------------
You can review and manage this inquiry in the Django Admin Dashboard.
"""
    try:
        send_mail(
            subject=admin_subject,
            message=admin_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=False,
        )
    except Exception as e:
        logger.warning(f"Admin email notification could not be sent: {e}")

    # 2. Acknowledgement email to Customer
    customer_subject = f"Thank you for reaching out to AURELIA Fine Jewellery"
    customer_message = f"""
Dear {enquiry.name},

Thank you for your interest in AURELIA Fine Jewellery.

We have received your enquiry regarding:
"{enquiry.subject}"

Our Private Jewellery Concierge team will review your request and reach out to you within 24 hours. If you require immediate assistance or wish to arrange an urgent private boutique appointment, please feel free to call us directly at +91 98765 43210 or connect with us on WhatsApp.

With warm regards,

The Concierge Team
AURELIA FINE JEWELLERY
123 Luxury Street, Chennai, Tamil Nadu, India
Phone: +91 98765 43210
Website: https://aureliajewels.com
"""
    try:
        send_mail(
            subject=customer_subject,
            message=customer_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[enquiry.email],
            fail_silently=False,
        )
    except Exception as e:
        logger.warning(f"Customer acknowledgement email could not be sent: {e}")


def send_password_reset_email(user, uid, token):
    """
    Sends a password reset link to the customer. The link points at the
    frontend reset-password page, which reads uid/token from the URL and
    posts them to /api/auth/reset-password/.
    """
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173').rstrip('/')
    reset_link = f"{frontend_url}/reset-password?uid={uid}&token={token}"

    subject = "Reset your AURELIA Fine Jewellery password"
    message = f"""
Hello {user.first_name or user.get_username()},

We received a request to reset the password for your AURELIA account.

Click the link below to choose a new password. This link is valid for a limited time and can only be used once:

{reset_link}

If you did not request a password reset, you can safely ignore this email.

With warm regards,
The Concierge Team
AURELIA FINE JEWELLERY
"""
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception as e:
        logger.warning(f"Password reset email could not be sent: {e}")


def send_order_confirmation_email(order):
    """
    Sends an order confirmation email once payment is confirmed.
    """
    items_lines = "\n".join(
        f"- {item.product_name} (Qty: {item.quantity}) - Rs. {item.price}"
        for item in order.items.all()
    )
    subject = f"Your AURELIA order {order.order_number} is confirmed"
    message = f"""
Dear {order.customer_name},

Thank you for your order with AURELIA Fine Jewellery. Your payment has been received and your order is now confirmed.

Order Number: {order.order_number}
Items:
{items_lines}

Total Paid: Rs. {order.total_amount}

You can track your order anytime using your order number and email/phone on our website, or message us on WhatsApp.

With warm regards,
The Concierge Team
AURELIA FINE JEWELLERY
"""
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.customer_email],
            fail_silently=False,
        )
    except Exception as e:
        logger.warning(f"Order confirmation email could not be sent: {e}")


def send_newsletter_welcome_email(email):
    """
    Sends a warm welcome acknowledgement email to the new newsletter subscriber.
    """
    subject = "Welcome to the AURELIA Private Circle"
    message = f"""
Welcome to the AURELIA Private Circle.

Thank you for subscribing to our private journal and exclusive releases. You will be among the first to receive invitations to private previews, limited haute joaillerie exhibitions, and curated insights into our master craftsmanship.

Discover our latest collections anytime at:
https://aureliajewels.com

Warmest regards,
AURELIA FINE JEWELLERY
"""
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
    except Exception as e:
        logger.warning(f"Newsletter confirmation email could not be sent: {e}")
