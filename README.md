# VETRI — Fine Jewellery (Haute Joaillerie)

A **premium, luxury, single-page jewellery shop website** with a high-end editorial visual style. Built with a **React + Vite** frontend and **Django REST Framework** backend.

---

## 💎 Project Overview

- **Brand**: `VETRI FINE JEWELLERY`
- **Design Aesthetic**: Luxury Haute Joaillerie editorial aesthetic (Warm Ivory `#F8F5F0`, Warm White `#FFFDF9`, Champagne `#E8DDCD`, Muted Gold `#B8945A`, Deep Charcoal `#1E1C1A`).
- **Typography**: Cormorant Garamond, Playfair Display, Cinzel, Montserrat.
- **Frontend Stack**: React 19, Vite, Tailwind CSS v4, Lucide React, Axios.
- **Backend Stack**: Django 5, Django REST Framework, SQLite (PostgreSQL-ready), Django Admin with image previews, CORS headers, SMTP email service.

---

## 📁 Repository Structure

```
aurelia-jewellery/
├── backend/
│   ├── aurelia_backend/
│   │   ├── settings.py          # Django settings & CORS configuration
│   │   ├── urls.py              # Root URL routing & Admin site branding
│   │   └── wsgi.py
│   ├── jewellery/
│   │   ├── models.py            # Category, JewelleryProduct, HeroBanner, Testimonial, etc.
│   │   ├── serializers.py       # DRF Serializers
│   │   ├── views.py             # Product, Category, Hero, Settings, Contact & Newsletter views
│   │   ├── urls.py              # App API endpoints
│   │   ├── emails.py            # Admin notification & customer acknowledgement emails
│   │   ├── admin.py             # Rich Django admin with thumbnails, badges & filters
│   │   └── management/commands/
│   │       └── seed_data.py     # Database seeding command for luxury items
│   ├── requirements.txt
│   ├── manage.py
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnnouncementBar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── FeaturedCollections.jsx
│   │   │   ├── EditorialSection.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductQuickViewModal.jsx
│   │   │   ├── WishlistDrawer.jsx
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── SearchModal.jsx
│   │   │   ├── BestsellerSection.jsx
│   │   │   ├── CampaignSection.jsx
│   │   │   ├── Craftsmanship.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── MapSection.jsx
│   │   │   ├── ContactSection.jsx
│   │   │   ├── Newsletter.jsx
│   │   │   ├── FloatingContactButtons.jsx
│   │   │   └── Footer.jsx
│   │   ├── services/
│   │   │   └── api.js           # Live Axios client + luxury fallback data
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env
│
├── start_backend.bat            # One-click start backend
├── start_frontend.bat           # One-click start frontend
└── README.md
```

---

## 🚀 Quick Start Guide

### Option 1: Using One-Click Batch Scripts (Windows)

1. Double-click `start_backend.bat` to launch Django REST API on `http://127.0.0.1:8000/`.
2. Double-click `start_frontend.bat` to launch Vite React on `http://localhost:5173/`.

---

### Option 2: Manual Terminal Startup

#### 1. Backend (Django REST Framework)

```powershell
cd backend
# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies (if needed)
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed database with initial luxury jewellery products, categories, hero & boutique settings
python manage.py seed_data

# Start server
python manage.py runserver 127.0.0.1:8000
```

#### 2. Frontend (React + Vite)

```powershell
cd frontend
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## 👑 Django Admin Portal

- **URL**: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
- **Username**: `admin`
- **Password**: `admin123`

### What you can modify in the Admin Panel:
1. **Jewellery Products**: Add new products, update prices, change diamond carats, upload HD photography or provide external URLs, set `is_bestseller` or `is_featured`.
2. **Categories**: Add, reorder, or edit categories (Diamonds, Gold, Bridal, etc.).
3. **Hero Banner**: Update the main headline, subtitle, background campaign image, and CTA links.
4. **Shop Settings**: Update boutique address in Chennai, phone number, WhatsApp number, email, Google Maps embed URL, direct navigation URL, and opening hours.
5. **Contact Enquiries**: View customer inquiries, read customer messages, and toggle unread/read badges.
6. **Newsletter Subscribers**: View all subscribers joined to the private circle.
7. **Testimonials**: Add and curate customer reviews with star ratings and photos.

---

## 🔗 Key Integrations

| Feature | Details |
|---|---|
| **WhatsApp Chat** | Directly links to `https://wa.me/919876543210` with pre-filled concierge message. |
| **Click-to-Call** | Triggers mobile device dialer / desktop phone handler with `tel:+919876543210`. |
| **Email Contact** | `POST /api/contact/` records in Django DB, sends notification to admin & confirmation email to customer. |
| **Google Maps** | Interactive map embed of boutique salon in Chennai + "Get Directions" navigation button. |
| **Intelligent Floating Buttons** | 3 circular luxury floating buttons (WhatsApp, Call, Email) that remain visible and automatically glide upward by 24px when approaching the footer to prevent overlap. |
| **Wishlist & Cart** | Interactive drawers with live counter badges, local storage persistence, and private concierge checkout simulation. |
| **Quick View** | Full modal with zoomable photo gallery, carat details, gold specs, and WhatsApp inquiry button. |
