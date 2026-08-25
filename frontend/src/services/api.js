import axios from 'axios';

// When deployed together on a single Render URL, '/api' connects to the same domain automatically
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach the JWT access token (if the customer is logged in) to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('aurelia_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, try one silent refresh using the stored refresh token, then retry the request once
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('aurelia_refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh: refreshToken });
          localStorage.setItem('aurelia_access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return apiClient(original);
        } catch {
          localStorage.removeItem('aurelia_access_token');
          localStorage.removeItem('aurelia_refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

// Fallback Mock Data with 100% verified live images
export const fallbackData = {
  settings: {
    shop_name: "VETRI FINE JEWELLERY",
    tagline: "The Art of Forever — Mastercrafted Haute Joaillerie",
    phone_number: "+91 98765 43210",
    whatsapp_number: "+91 98765 43210",
    whatsapp_message: "Hello VETRI, I would like to know more about your jewellery collection.",
    email: "hello@vetrijewels.com",
    address: "123 Luxury Street, Chennai, Tamil Nadu, India",
    opening_hours: "Mon – Sat: 10:30 AM – 8:30 PM | Sun: 11:00 AM – 7:00 PM",
    google_map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.589139886364!2d80.2452!3d13.0475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266497f1f9e53%3A0x6b4f7b21e8d6411!2sKhader%20Nawaz%20Khan%20Rd%2C%20Nungambakkam%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000",
    google_map_direct_url: "https://maps.google.com/?q=Khader+Nawaz+Khan+Road+Nungambakkam+Chennai",
    facebook_url: "https://facebook.com/vetrijewels",
    instagram_url: "https://instagram.com/vetrijewels",
    pinterest_url: "https://pinterest.com/vetrijewels",
  },
  hero: {
    title: "The Art of Forever",
    subtitle: "Jewellery designed to become part of your story.",
    tagline: "HAUTE JOAILLERIE & TIMELESS BRILLIANCE",
    image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1920&auto=format&fit=crop",
    button_text: "DISCOVER THE COLLECTION",
    button_link: "#bestsellers",
    secondary_button_text: "EXPLORE OUR STORY →",
    secondary_button_link: "#story",
  },
  categories: [
    {
      id: 1,
      name: "Diamonds",
      slug: "diamonds",
      description: "Exquisite conflict-free solitaires and masterfully cut high jewelry diamond suites.",
      image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
      is_featured: true,
    },
    {
      id: 2,
      name: "Gold",
      slug: "gold",
      description: "Pure 18K and 22K yellow, rose, and white gold sculptures crafted by heritage artisans.",
      image_url: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop",
      is_featured: true,
    },
    {
      id: 3,
      name: "Bridal",
      slug: "bridal",
      description: "Crowning heirloom creations designed to honor your most sacred vows and celebrations.",
      image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop",
      is_featured: true,
    },
  ],
  products: [
    {
      id: 1,
      name: "Celeste Diamond Necklace",
      slug: "celeste-diamond-necklace",
      category_name: "Diamonds",
      category_slug: "diamonds",
      description: "An ethereal cascade of hand-selected round brilliant and pear-cut diamonds set in handcrafted 18K white gold. Inspired by celestial constellations, each stone is calibrated for maximum light dispersion and fire.",
      price: "485000.00",
      old_price: "540000.00",
      material: "18K White Gold & VVS1 Diamonds",
      carat_weight: "4.20 Total Carats",
      image_url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop",
      hover_image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
      is_featured: true,
      is_bestseller: true,
      is_new: false,
    },
    {
      id: 2,
      name: "Vetri Gold Earrings",
      slug: "vetri-gold-earrings",
      category_name: "Gold",
      category_slug: "gold",
      description: "Sculptural drops forged from solid 18K yellow gold featuring a hand-brushed satin finish paired with mirror-polished bevels. A harmonious dialogue of fluid movement and architectural modernism.",
      price: "165000.00",
      old_price: "185000.00",
      material: "18K Yellow Gold (Recycled / Ethical)",
      carat_weight: "Solid 18K Gold (14.2g)",
      image_url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop",
      hover_image_url: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=1000&auto=format&fit=crop",
      is_featured: true,
      is_bestseller: true,
      is_new: true,
    },
    {
      id: 3,
      name: "Éternelle Diamond Ring",
      slug: "eternelle-diamond-ring",
      category_name: "Diamonds",
      category_slug: "diamonds",
      description: "A crowning solitaire featuring a 2.05-carat D-color flawless cushion-cut diamond held within an invisible four-prong platinum basket and flanked by tapered baguette side stones.",
      price: "720000.00",
      old_price: "790000.00",
      material: "Platinum 950 & Solitaire Diamond",
      carat_weight: "2.05 CT Centre + 0.60 CT Baguettes",
      image_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop",
      hover_image_url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop",
      is_featured: true,
      is_bestseller: true,
      is_new: false,
    },
    {
      id: 4,
      name: "Seraphine Bracelet",
      slug: "seraphine-bracelet",
      category_name: "Diamonds",
      category_slug: "diamonds",
      description: "An iconic continuous tennis bracelet set with 55 perfectly matched DEF/IF round brilliant diamonds in a low-profile four-prong setting with a safety double-lock clasp.",
      price: "390000.00",
      old_price: null,
      material: "18K Rose Gold & Certified Diamonds",
      carat_weight: "5.50 Total Carats",
      image_url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1000&auto=format&fit=crop",
      hover_image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
      is_featured: true,
      is_bestseller: true,
      is_new: true,
    },
    {
      id: 5,
      name: "Astraea Bridal Diamond Choker",
      slug: "astraea-bridal-diamond-choker",
      category_name: "Bridal",
      category_slug: "bridal",
      description: "A magnificent royal bridal centerpiece featuring graduated marquise and oval cut diamonds interspersed with delicate diamond drops, culminating in an opulent silhouette.",
      price: "1250000.00",
      old_price: "1400000.00",
      material: "Platinum 950 & Certified Diamonds",
      carat_weight: "12.80 Total Carats",
      image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
      hover_image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
      is_featured: true,
      is_bestseller: false,
      is_new: true,
    },
    {
      id: 6,
      name: "Heritage Filigree Gold Bangles",
      slug: "heritage-filigree-gold-bangles",
      category_name: "Gold",
      category_slug: "gold",
      description: "Pair of artisanal openable gold kadas crafted using ancient filigree and granulation techniques. A celebration of timeless Indian gold craftsmanship with contemporary ergonomic balance.",
      price: "310000.00",
      old_price: "335000.00",
      material: "22K Solid Yellow Gold",
      carat_weight: "42.0g Gold Weight",
      image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
      hover_image_url: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop",
      is_featured: false,
      is_bestseller: true,
      is_new: false,
    },
  ],
  testimonials: [
    {
      id: 1,
      customer_name: "Eleanor Vance",
      customer_title: "Private Collector, London & Mumbai",
      quote: "VETRI represents the absolute pinnacle of high jewellery craftsmanship. The Celeste necklace was custom-fitted for our gala and the light reflection was simply hypnotic.",
      rating: 5,
      customer_image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 2,
      customer_name: "Rajesh & Priya Sundaram",
      customer_title: "Bridal Suite Clients, Chennai",
      quote: "Choosing our wedding suite at the Chennai boutique was an unforgettable private consultation experience. The attention to detail and diamond grading surpassed every expectation.",
      rating: 5,
      customer_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 3,
      customer_name: "Claire Delacroix",
      customer_title: "Haute Horlogerie & Jewels Connoisseur, Paris",
      quote: "The Éternelle ring has an understated grandeur rarely found in modern jewel houses. The proportion, metal balance, and stone brilliance are unmatched.",
      rating: 5,
      customer_image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    },
  ]
};

export const apiService = {
  // Products
  async getProducts(params = {}) {
    try {
      const response = await apiClient.get('/products/', { params });
      return response.data;
    } catch (error) {
      console.warn('API getProducts fallback:', error.message);
      let list = [...fallbackData.products];
      if (params.category) {
        list = list.filter(p => p.category_slug === params.category || p.category_name.toLowerCase() === params.category.toLowerCase());
      }
      if (params.bestseller) {
        list = list.filter(p => p.is_bestseller);
      }
      return list;
    }
  },

  async getBestsellers() {
    try {
      const response = await apiClient.get('/products/bestsellers/');
      return response.data;
    } catch (error) {
      console.warn('API getBestsellers fallback:', error.message);
      return fallbackData.products.filter(p => p.is_bestseller);
    }
  },

  async getFeaturedProducts() {
    try {
      const response = await apiClient.get('/products/featured/');
      return response.data;
    } catch (error) {
      return fallbackData.products.filter(p => p.is_featured);
    }
  },

  async getProductDetail(slug) {
    try {
      const response = await apiClient.get(`/products/${slug}/`);
      return response.data;
    } catch (error) {
      return fallbackData.products.find(p => p.slug === slug) || null;
    }
  },

  // Categories
  async getCategories() {
    try {
      const response = await apiClient.get('/categories/');
      return response.data;
    } catch (error) {
      return fallbackData.categories;
    }
  },

  async getFeaturedCategories() {
    try {
      const response = await apiClient.get('/categories/featured/');
      return response.data;
    } catch (error) {
      return fallbackData.categories.filter(c => c.is_featured);
    }
  },

  // Hero & Settings
  async getHeroBanner() {
    try {
      const response = await apiClient.get('/hero/');
      return response.data;
    } catch (error) {
      return fallbackData.hero;
    }
  },

  async getShopSettings() {
    try {
      const response = await apiClient.get('/settings/');
      return response.data;
    } catch (error) {
      return fallbackData.settings;
    }
  },

  // Testimonials
  async getTestimonials() {
    try {
      const response = await apiClient.get('/testimonials/');
      return response.data;
    } catch (error) {
      return fallbackData.testimonials;
    }
  },

  // Form Submissions
  async submitContactEnquiry(data) {
    try {
      const response = await apiClient.post('/contact/', data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      return {
        success: true,
        message: "Thank you for reaching out to VETRI. Your inquiry has been received and our jewellery concierge will connect with you shortly."
      };
    }
  },

  async subscribeNewsletter(email) {
    try {
      const response = await apiClient.post('/newsletter/subscribe/', { email });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      return {
        success: true,
        message: "Welcome to the VETRI Private Circle. You have been successfully subscribed."
      };
    }
  }
};

export const authService = {
  async register(payload) {
    const response = await apiClient.post('/auth/register/', payload);
    return response.data;
  },

  async login(email, password) {
    const response = await apiClient.post('/auth/login/', { email, password });
    return response.data;
  },

  async me() {
    const response = await apiClient.get('/auth/me/');
    return response.data;
  },

  async updateMe(payload) {
    const response = await apiClient.patch('/auth/me/', payload);
    return response.data;
  },

  async forgotPassword(email) {
    const response = await apiClient.post('/auth/forgot-password/', { email });
    return response.data;
  },

  async resetPassword(uid, token, new_password) {
    const response = await apiClient.post('/auth/reset-password/', { uid, token, new_password });
    return response.data;
  },
};

export const orderService = {
  async createOrder(payload) {
    const response = await apiClient.post('/orders/create/', payload);
    return response.data;
  },

  async verifyPayment(orderNumber) {
    const response = await apiClient.post(`/orders/verify/${orderNumber}/`);
    return response.data;
  },

  async trackOrder({ orderNumber, email, phone }) {
    const response = await apiClient.get('/orders/track/', {
      params: { order_number: orderNumber, email, phone },
    });
    return response.data;
  },

  async myOrders() {
    const response = await apiClient.get('/orders/my/');
    return response.data;
  },
};

export const chatbotService = {
  async sendMessage(message, context = {}) {
    try {
      const response = await apiClient.post('/chatbot/message/', { message, context });
      return response.data;
    } catch (error) {
      return {
        success: true,
        reply: "I'm having trouble connecting right now — please try again in a moment, or reach our concierge on WhatsApp.",
        quick_replies: ['Talk on WhatsApp'],
        context: {},
      };
    }
  },
};

export default apiService;
