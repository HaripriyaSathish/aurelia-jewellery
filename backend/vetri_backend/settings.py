from datetime import timedelta
from pathlib import Path
import os
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(os.path.join(BASE_DIR, '.env'))

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-vetri-jewellery-luxury-key-default-2026')

DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic',
    'cloudinary_storage',
    'django.contrib.staticfiles',
    'cloudinary',

    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',

    # Custom apps
    'jewellery',
    'accounts',
    'orders',
    'chatbot',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'vetri_backend.urls'

FRONTEND_DIST = os.path.join(BASE_DIR.parent, 'frontend', 'dist')

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
            FRONTEND_DIST,
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media',
            ],
        },
    },
]

WSGI_APPLICATION = 'vetri_backend.wsgi.application'

# Uses a persistent Postgres database when DATABASE_URL is set (required on
# Render's free plan, where the local disk — and any SQLite file on it — is
# wiped on every deploy). Falls back to a local SQLite file otherwise, which
# is fine for local development.
if os.getenv('DATABASE_URL'):
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.config(env='DATABASE_URL', conn_max_age=600, ssl_require=True)
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = []
if os.path.exists(FRONTEND_DIST):
    STATICFILES_DIRS.append(FRONTEND_DIST)

# WhiteNoise Configuration for serving static and root assets
WHITENOISE_ROOT = FRONTEND_DIST
WHITENOISE_INDEX_FILE = True
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Uploaded product images (Django admin's Image field) go to Cloudinary
# when CLOUDINARY_URL is set — required in production, since Render's
# disk is ephemeral and media files aren't served there at all when
# DEBUG=False. Falls back to local disk storage when unset, which is
# fine for local dev.
if os.getenv('CLOUDINARY_URL'):
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS
CORS_ALLOW_ALL_ORIGINS = True

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=14),
    'ROTATE_REFRESH_TOKENS': True,
}

# Frontend base URL, used to build password-reset and payment-return links
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')

# Cashfree Payment Gateway (Test/Sandbox mode by default)
CASHFREE_APP_ID = os.getenv('CASHFREE_APP_ID', '')
CASHFREE_SECRET_KEY = os.getenv('CASHFREE_SECRET_KEY', '')
CASHFREE_ENV = os.getenv('CASHFREE_ENV', 'TEST')  # 'TEST' or 'PRODUCTION'

# GST rate applied at checkout (split evenly into CGST + SGST for the invoice).
# Default 3% matches the standard GST slab for gold/diamond jewellery in India.
GST_RATE = float(os.getenv('GST_RATE', '0.03'))
GSTIN = os.getenv('GSTIN', '')  # your business GSTIN, shown on the invoice PDF if set

# WhatsApp Business Cloud API (optional — click-to-chat links work without this)
WHATSAPP_CLOUD_TOKEN = os.getenv('WHATSAPP_CLOUD_TOKEN', '')
WHATSAPP_PHONE_NUMBER_ID = os.getenv('WHATSAPP_PHONE_NUMBER_ID', '')

# Alternative to the above: Twilio's WhatsApp API (e.g. their free Sandbox,
# no Meta Business verification needed for testing). If these are set,
# they take priority over WHATSAPP_CLOUD_TOKEN/WHATSAPP_PHONE_NUMBER_ID.
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '')
TWILIO_WHATSAPP_FROM = os.getenv('TWILIO_WHATSAPP_FROM', '')  # e.g. whatsapp:+14155238886

# Groq API key for the AI chatbot's open-ended answers (optional —
# rule-based offers/order-tracking replies work without it)
GROQ_API_KEY = os.getenv('GROQ_API_KEY', '')
GROQ_MODEL = os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile')

# Email Settings
EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'VETRI Fine Jewellery <concierge@vetrijewels.com>')
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'concierge@vetrijewels.com')
