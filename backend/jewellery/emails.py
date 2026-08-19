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
