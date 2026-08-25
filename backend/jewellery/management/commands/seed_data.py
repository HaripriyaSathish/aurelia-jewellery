from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from jewellery.models import (
    Category,
    JewelleryProduct,
    HeroBanner,
    Testimonial,
    ShopSettings,
    ContactEnquiry,
    NewsletterSubscriber
)

class Command(BaseCommand):
    help = 'Seeds initial luxury jewellery data for VETRI FINE JEWELLERY'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE('Starting VETRI luxury database seeding...'))

        # 1. Superuser
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@vetrijewels.com', 'admin123')
            self.stdout.write(self.style.SUCCESS('Created superuser: admin (password: admin123)'))
        else:
            self.stdout.write(self.style.WARNING('Superuser "admin" already exists.'))

        # 2. Shop Settings
        settings, created = ShopSettings.objects.get_or_create(pk=1)
        settings.shop_name = "VETRI FINE JEWELLERY"
        settings.tagline = "The Art of Forever — Mastercrafted Haute Joaillerie"
        settings.phone_number = "+91 98765 43210"
        settings.whatsapp_number = "+91 98765 43210"
        settings.whatsapp_message = "Hello VETRI, I would like to know more about your jewellery collection."
        settings.email = "hello@vetrijewels.com"
        settings.address = "123 Luxury Street, Chennai, Tamil Nadu, India"
        settings.opening_hours = "Mon – Sat: 10:30 AM – 8:30 PM | Sun: 11:00 AM – 7:00 PM"
        settings.google_map_embed_url = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.589139886364!2d80.2452!3d13.0475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266497f1f9e53%3A0x6b4f7b21e8d6411!2sKhader%20Nawaz%20Khan%20Rd%2C%20Nungambakkam%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000"
        settings.google_map_direct_url = "https://maps.google.com/?q=Khader+Nawaz+Khan+Road+Nungambakkam+Chennai"
        settings.facebook_url = "https://facebook.com/vetrijewels"
        settings.instagram_url = "https://instagram.com/vetrijewels"
        settings.pinterest_url = "https://pinterest.com/vetrijewels"
        settings.save()
        self.stdout.write(self.style.SUCCESS('Updated Shop Settings.'))

        # 3. Categories
        categories_data = [
            {
                "name": "Diamonds",
                "slug": "diamonds",
                "description": "Exquisite conflict-free solitaires and masterfully cut high jewelry diamond suites.",
                "image_url": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
                "is_featured": True,
                "order": 1,
            },
            {
                "name": "Gold",
                "slug": "gold",
                "description": "Pure 18K and 22K yellow, rose, and white gold sculptures crafted by heritage artisans.",
                "image_url": "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop",
                "is_featured": True,
                "order": 2,
            },
            {
                "name": "Bridal",
                "slug": "bridal",
                "description": "Crowning heirloom creations designed to honor your most sacred vows and celebrations.",
                "image_url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop",
                "is_featured": True,
                "order": 3,
            },
            {
                "name": "Rings",
                "slug": "rings",
                "description": "Solitaires, trilogy bands, and iconic statement cocktail rings.",
                "image_url": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
                "is_featured": False,
                "order": 4,
            },
            {
                "name": "Necklaces",
                "slug": "necklaces",
                "description": "Cascading diamond rivières, chokers, and sculpted gold pendants.",
                "image_url": "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1200&auto=format&fit=crop",
                "is_featured": False,
                "order": 5,
            },
            {
                "name": "Earrings",
                "slug": "earrings",
                "description": "Chandelier drops, diamond huggies, and architectural gold studs.",
                "image_url": "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1200&auto=format&fit=crop",
                "is_featured": False,
                "order": 6,
            },
            {
                "name": "Bracelets",
                "slug": "bracelets",
                "description": "Tennis bracelets, articulated cuffs, and high jewelry bangles.",
                "image_url": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1200&auto=format&fit=crop",
                "is_featured": False,
                "order": 7,
            },
        ]

        cat_objs = {}
        for cdata in categories_data:
            cat, _ = Category.objects.update_or_create(
                slug=cdata['slug'],
                defaults=cdata
            )
            cat_objs[cat.slug] = cat
        self.stdout.write(self.style.SUCCESS(f'Created/Updated {len(cat_objs)} Categories.'))

        # 4. Jewellery Products
        products_data = [
            {
                "name": "Celeste Diamond Necklace",
                "slug": "celeste-diamond-necklace",
                "category": cat_objs["diamonds"],
                "description": "An ethereal cascade of hand-selected round brilliant and pear-cut diamonds set in handcrafted 18K white gold. Inspired by celestial constellations, each stone is calibrated for maximum light dispersion and fire.",
                "price": 485000.00,
                "old_price": 540000.00,
                "material": "18K White Gold & VVS1 Diamonds",
                "carat_weight": "4.20 Total Carats",
                "image_url": "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop",
                "hover_image_url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
                "is_featured": True,
                "is_bestseller": True,
                "is_new": False,
            },
            {
                "name": "Vetri Gold Earrings",
                "slug": "vetri-gold-earrings",
                "category": cat_objs["gold"],
                "description": "Sculptural drops forged from solid 18K yellow gold featuring a hand-brushed satin finish paired with mirror-polished bevels. A harmonious dialogue of fluid movement and architectural modernism.",
                "price": 165000.00,
                "old_price": 185000.00,
                "material": "18K Yellow Gold (Recycled / Ethical)",
                "carat_weight": "Solid 18K Gold (14.2g)",
                "image_url": "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop",
                "hover_image_url": "https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=1000&auto=format&fit=crop",
                "is_featured": True,
                "is_bestseller": True,
                "is_new": true if False else False,
                "is_new": True,
            },
            {
                "name": "Éternelle Diamond Ring",
                "slug": "eternelle-diamond-ring",
                "category": cat_objs["diamonds"],
                "description": "A crowning solitaire featuring a 2.05-carat D-color flawless cushion-cut diamond held within an invisible four-prong platinum basket and flanked by tapered baguette side stones.",
                "price": 720000.00,
                "old_price": 790000.00,
                "material": "Platinum 950 & Solitaire Diamond",
                "carat_weight": "2.05 CT Centre + 0.60 CT Baguettes",
                "image_url": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop",
                "hover_image_url": "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop",
                "is_featured": True,
                "is_bestseller": True,
                "is_new": False,
            },
            {
                "name": "Seraphine Bracelet",
                "slug": "seraphine-bracelet",
                "category": cat_objs["diamonds"],
                "description": "An iconic continuous tennis bracelet set with 55 perfectly matched DEF/IF round brilliant diamonds in a low-profile four-prong setting with a safety double-lock clasp.",
                "price": 390000.00,
                "old_price": None,
                "material": "18K Rose Gold & Certified Diamonds",
                "carat_weight": "5.50 Total Carats",
                "image_url": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1000&auto=format&fit=crop",
                "hover_image_url": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
                "is_featured": True,
                "is_bestseller": True,
                "is_new": True,
            },
            {
                "name": "Astraea Bridal Diamond Choker",
                "slug": "astraea-bridal-diamond-choker",
                "category": cat_objs["bridal"],
                "description": "A magnificent royal bridal centerpiece featuring graduated marquise and oval cut diamonds interspersed with delicate diamond drops, culminating in an opulent silhouette.",
                "price": 1250000.00,
                "old_price": 1400000.00,
                "material": "Platinum 950 & Certified Diamonds",
                "carat_weight": "12.80 Total Carats",
                "image_url": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
                "hover_image_url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
                "is_featured": True,
                "is_bestseller": False,
                "is_new": True,
            },
            {
                "name": "Heritage Filigree Gold Bangles",
                "slug": "heritage-filigree-gold-bangles",
                "category": cat_objs["gold"],
                "description": "Pair of artisanal openable gold kadas crafted using ancient filigree and granulation techniques. A celebration of timeless Indian gold craftsmanship with contemporary ergonomic balance.",
                "price": 310000.00,
                "old_price": 335000.00,
                "material": "22K Solid Yellow Gold",
                "carat_weight": "42.0g Gold Weight",
                "image_url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
                "hover_image_url": "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop",
                "is_featured": False,
                "is_bestseller": True,
                "is_new": False,
            },
            {
                "name": "Lumière Emerald-Cut Solitaire Ring",
                "slug": "lumiere-emerald-cut-solitaire-ring",
                "category": cat_objs["rings"],
                "description": "An architectural masterpiece showcasing a 3.10-carat emerald-cut diamond with step facets that reflect pure light, framed by an 18K yellow gold bezel setting.",
                "price": 890000.00,
                "old_price": 950000.00,
                "material": "18K Yellow Gold & Emerald Cut Diamond",
                "carat_weight": "3.10 CT Centre Diamond",
                "image_url": "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop",
                "hover_image_url": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop",
                "is_featured": True,
                "is_bestseller": False,
                "is_new": True,
            },
            {
                "name": "Valence Diamond Chandelier Drops",
                "slug": "valence-diamond-chandelier-drops",
                "category": cat_objs["earrings"],
                "description": "Articulated diamond drop earrings engineered to catch every flicker of light. Featuring pear and round cut diamonds in a tiered geometric silhouette.",
                "price": 275000.00,
                "old_price": 295000.00,
                "material": "18K White Gold & Diamonds",
                "carat_weight": "3.40 Total Carats",
                "image_url": "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop",
                "hover_image_url": "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop",
                "is_featured": False,
                "is_bestseller": False,
                "is_new": True,
            }
        ]

        for pdata in products_data:
            JewelleryProduct.objects.update_or_create(
                slug=pdata['slug'],
                defaults=pdata
            )
        self.stdout.write(self.style.SUCCESS(f'Created/Updated {len(products_data)} Jewellery Products.'))

        # 5. Hero Banner
        HeroBanner.objects.update_or_create(
            id=1,
            defaults={
                "title": "The Art of Forever",
                "subtitle": "Jewellery designed to become part of your story.",
                "tagline": "HAUTE JOAILLERIE & TIMELESS BRILLIANCE",
                "image_url": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1920&auto=format&fit=crop",
                "button_text": "DISCOVER THE COLLECTION",
                "button_link": "#bestsellers",
                "secondary_button_text": "EXPLORE OUR STORY →",
                "secondary_button_link": "#story",
                "is_active": True
            }
        )
        self.stdout.write(self.style.SUCCESS('Created/Updated Hero Banner.'))

        # 6. Testimonials
        testimonials_data = [
            {
                "customer_name": "Eleanor Vance",
                "customer_title": "Private Collector, London & Mumbai",
                "quote": "VETRI represents the absolute pinnacle of high jewellery craftsmanship. The Celeste necklace was custom-fitted for our gala and the light reflection was simply hypnotic.",
                "rating": 5,
                "customer_image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
                "is_active": True,
            },
            {
                "customer_name": "Rajesh & Priya Sundaram",
                "customer_title": "Bridal Suite Clients, Chennai",
                "quote": "Choosing our wedding suite at the Chennai boutique was an unforgettable private consultation experience. The attention to detail and diamond grading surpassed every expectation.",
                "rating": 5,
                "customer_image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
                "is_active": True,
            },
            {
                "customer_name": "Claire Delacroix",
                "customer_title": "Haute Horlogerie & Jewels Connoisseur, Paris",
                "quote": "The Éternelle ring has an understated grandeur rarely found in modern jewel houses. The proportion, metal balance, and stone brilliance are unmatched.",
                "rating": 5,
                "customer_image_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
                "is_active": True,
            }
        ]

        for tdata in testimonials_data:
            Testimonial.objects.update_or_create(
                customer_name=tdata['customer_name'],
                defaults=tdata
            )
        self.stdout.write(self.style.SUCCESS(f'Created/Updated {len(testimonials_data)} Testimonials.'))

        self.stdout.write(self.style.SUCCESS('VETRI database seeding completed successfully!'))
