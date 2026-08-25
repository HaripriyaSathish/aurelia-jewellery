"""
Generates a proper tax invoice PDF for a paid Order — line items, CGST/SGST
breakdown, transaction ID and payment method — using reportlab (pure Python,
no system dependencies).
"""
from io import BytesIO

from django.conf import settings
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT, TA_CENTER

GOLD = colors.HexColor('#B8945A')
GOLD_DARK = colors.HexColor('#9C7A42')
CHARCOAL = colors.HexColor('#1E1C1A')
LIGHT_BORDER = colors.HexColor('#E8DDCD')
CREAM = colors.HexColor('#FBF7EF')
CREAM_BAND = colors.HexColor('#F3EADC')
SUCCESS_GREEN = colors.HexColor('#2E7D4F')
MUTED_TEXT = colors.HexColor('#5C574F')


def generate_invoice_pdf(order):
    """Returns a BytesIO containing the invoice PDF for the given (paid) Order."""
    from jewellery.models import ShopSettings

    shop = ShopSettings.load()
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        topMargin=20 * mm, bottomMargin=20 * mm, leftMargin=18 * mm, rightMargin=18 * mm,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('InvoiceTitle', parent=styles['Title'], textColor=colors.white, fontSize=20, spaceAfter=2)
    invoice_tag_style = ParagraphStyle('InvoiceTag', parent=styles['Normal'], textColor=colors.white, fontSize=9, alignment=TA_RIGHT, leading=12)
    invoice_number_style = ParagraphStyle('InvoiceNumber', parent=invoice_tag_style, fontSize=14, fontName='Helvetica-Bold', spaceBefore=2)
    label_style = ParagraphStyle('Label', parent=styles['Normal'], textColor=GOLD_DARK, fontSize=8, spaceAfter=1)
    normal_style = ParagraphStyle('NormalSmall', parent=styles['Normal'], fontSize=9, leading=13)
    muted_style = ParagraphStyle('Muted', parent=normal_style, textColor=MUTED_TEXT)
    right_style = ParagraphStyle('Right', parent=normal_style, alignment=TA_RIGHT)
    center_style = ParagraphStyle('Center', parent=normal_style, alignment=TA_CENTER)
    status_style = ParagraphStyle('Status', parent=styles['Normal'], textColor=colors.white, fontSize=9, fontName='Helvetica-Bold', alignment=TA_CENTER)

    elements = []

    # Header banner: shop name + invoice title/number on a gold background
    header_data = [[
        Paragraph(f"<b>{shop.shop_name}</b>", title_style),
        Paragraph(f"TAX INVOICE<br/><b>#{order.order_number}</b>", invoice_tag_style),
    ]]
    header_table = Table(header_data, colWidths=[100 * mm, 72 * mm])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BACKGROUND', (0, 0), (-1, -1), GOLD),
        ('LEFTPADDING', (0, 0), (0, 0), 12),
        ('RIGHTPADDING', (-1, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 14),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 14),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 6 * mm))

    elements.append(Paragraph(shop.address, muted_style))
    gstin_line = f"GSTIN: {settings.GSTIN}" if settings.GSTIN else "GSTIN: (not configured)"
    elements.append(Paragraph(f"{gstin_line} | Phone: {shop.phone_number} | Email: {shop.email}", muted_style))
    elements.append(Spacer(1, 8 * mm))

    # Bill To / Invoice meta, in a cream box with a gold status chip
    invoice_date = order.updated_at.strftime('%d %b %Y, %I:%M %p')
    status_color = SUCCESS_GREEN if order.status in ('PAID', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED') else GOLD_DARK
    meta_data = [[
        Paragraph(
            f"<font color='#B8945A'><b>BILL TO</b></font><br/>{order.customer_name}<br/>{order.customer_email}<br/>{order.customer_phone}"
            + (f"<br/>{order.address}, {order.city}" if order.address else ""),
            normal_style,
        ),
        [
            Paragraph(
                f"<b>Invoice Date:</b> {invoice_date}<br/>"
                f"<b>Order Number:</b> {order.order_number}<br/>"
                f"<b>Transaction ID:</b> {order.transaction_id or '-'}<br/>"
                f"<b>Payment Mode:</b> {order.payment_method or '-'}",
                right_style,
            ),
            Spacer(1, 3 * mm),
            Table(
                [[Paragraph(order.get_status_display().upper(), status_style)]],
                colWidths=[45 * mm],
                style=TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), status_color),
                    ('TOPPADDING', (0, 0), (-1, -1), 5),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
                ]),
                hAlign='RIGHT',
            ),
        ],
    ]]
    meta_table = Table(meta_data, colWidths=[100 * mm, 72 * mm])
    meta_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BACKGROUND', (0, 0), (-1, -1), CREAM),
        ('BOX', (0, 0), (-1, -1), 0.75, LIGHT_BORDER),
        ('LINEBEFORE', (0, 0), (0, -1), 3, GOLD),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (0, -1), 10),
        ('RIGHTPADDING', (-1, 0), (-1, -1), 10),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 8 * mm))

    # Line items table
    item_rows = [["ITEM", "QTY", "UNIT PRICE", "AMOUNT"]]
    for item in order.items.all():
        amount = item.price * item.quantity
        item_rows.append([
            Paragraph(item.product_name, normal_style),
            Paragraph(str(item.quantity), center_style),
            Paragraph(f"Rs. {item.price:,.2f}", right_style),
            Paragraph(f"Rs. {amount:,.2f}", right_style),
        ])

    items_table = Table(item_rows, colWidths=[86 * mm, 18 * mm, 34 * mm, 34 * mm])
    row_band_style = [
        ('BACKGROUND', (0, r), (-1, r), CREAM_BAND if r % 2 == 0 else colors.white)
        for r in range(1, len(item_rows))
    ]
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), GOLD),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ALIGN', (1, 0), (1, 0), 'CENTER'),
        ('ALIGN', (2, 0), (-1, 0), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.5, LIGHT_BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        *row_band_style,
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 4 * mm))

    # Totals, with the grand total row highlighted in gold
    totals_rows = [
        ["Subtotal", f"Rs. {order.subtotal:,.2f}"],
        [f"CGST ({settings.GST_RATE * 50:.2f}%)", f"Rs. {order.cgst_amount:,.2f}"],
        [f"SGST ({settings.GST_RATE * 50:.2f}%)", f"Rs. {order.sgst_amount:,.2f}"],
        ["Grand Total", f"Rs. {order.total_amount:,.2f}"],
    ]
    totals_table = Table(totals_rows, colWidths=[118 * mm, 54 * mm])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('TEXTCOLOR', (0, 0), (-1, 2), MUTED_TEXT),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BACKGROUND', (0, -1), (-1, -1), GOLD),
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.white),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, -1), (-1, -1), 12),
        ('TOPPADDING', (0, -1), (-1, -1), 7),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 7),
        ('RIGHTPADDING', (-1, -1), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, 2), 4),
        ('BOTTOMPADDING', (0, 0), (-1, 2), 4),
    ]))
    elements.append(totals_table)
    elements.append(Spacer(1, 12 * mm))

    footer_style = ParagraphStyle('Footer', parent=normal_style, fontSize=8, textColor=MUTED_TEXT)
    elements.append(Table(
        [[""]], colWidths=[136 * mm],
        style=TableStyle([('LINEABOVE', (0, 0), (-1, 0), 1, GOLD)]),
    ))
    elements.append(Spacer(1, 4 * mm))
    elements.append(Paragraph(
        "This is a system-generated tax invoice for your VETRI Fine Jewellery purchase. "
        "For any questions about this order, please contact our concierge team.",
        footer_style,
    ))

    doc.build(elements)
    buffer.seek(0)
    return buffer
