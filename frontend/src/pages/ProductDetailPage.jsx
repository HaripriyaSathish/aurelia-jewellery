import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, MessageCircle, ShieldCheck, Truck, RefreshCw, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';
import { useShopData } from '../context/ShopDataContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { onAddToCart, onToggleWishlist, wishlist } = useOutletContext();
  const { products, settings } = useShopData();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiService.getProductDetail(slug).then((data) => {
      setProduct(data);
      setSelectedImg(data?.image_url);
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, [slug]);

  const formatPrice = (val) => {
    if (!val) return '';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(val));
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-[#5C574F] text-sm pt-20">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20 text-center px-4">
        <p className="font-serif text-2xl text-[#1E1C1A] mb-3">Piece Not Found</p>
        <p className="text-sm text-[#5C574F] mb-6">This creation may have been reserved or retired from our collection.</p>
        <Link to="/" className="px-6 py-2.5 bg-[#1E1C1A] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#B8945A] transition-colors">
          Discover Collections
        </Link>
      </div>
    );
  }

  const images = [product.image_url, product.hover_image_url].filter(Boolean);
  const isWishlisted = wishlist.some((w) => w.id === product.id);

  const whatsappNumber = (settings?.whatsapp_number || '').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello, I would like to inquire about the ${product.name} (Ref: ${product.slug}).`
  )}`;

  const related = products.filter((p) => p.category_slug === product.category_slug && p.id !== product.id).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#5C574F] uppercase tracking-wider mb-8">
        <Link to="/" className="hover:text-[#B8945A]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span>{product.category_name}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1E1C1A]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden mb-4 bg-[#F8F5F0] border border-[#E8DDCD]">
            <img src={selectedImg || product.image_url} alt={product.name} className="w-full h-full object-cover object-center" />
            <span className="absolute top-4 left-4 bg-[#B8945A] text-white text-[9px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1 shadow-sm">
              CERTIFIED AUTHENTIC
            </span>
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-20 border-2 overflow-hidden transition-all ${
                    (selectedImg || product.image_url) === img ? 'border-[#B8945A] opacity-100' : 'border-[#E8DDCD] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-[#B8945A] font-semibold mb-2">
            {product.category_name || 'HAUTE JOAILLERIE'}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1E1C1A] font-medium tracking-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl sm:text-3xl font-semibold text-[#1E1C1A]">{formatPrice(product.price)}</span>
            {product.old_price && (
              <span className="text-base text-[#5C574F] line-through">{formatPrice(product.old_price)}</span>
            )}
          </div>

          <p className="text-sm text-[#5C574F] leading-relaxed mb-8">{product.description}</p>

          <div className="bg-[#FFFDF9] border border-[#E8DDCD] p-5 mb-8 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#5C574F]">Precious Metal</span>
              <span className="font-medium text-[#1E1C1A]">{product.material}</span>
            </div>
            {product.carat_weight && (
              <div className="flex justify-between">
                <span className="text-[#5C574F]">Gemstone Carat</span>
                <span className="font-medium text-[#1E1C1A]">{product.carat_weight}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#5C574F]">Certification</span>
              <span className="font-medium text-[#1E1C1A]">GIA / IGI Verified Hallmark</span>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 py-4 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
            >
              <ShoppingBag className="w-4 h-4 text-[#E8DDCD]" />
              <span>ADD TO SHOPPING BAG</span>
            </button>
            <button
              onClick={() => onToggleWishlist(product)}
              className={`px-5 py-4 border transition-all ${
                isWishlisted ? 'border-[#B8945A] bg-[#B8945A] text-white' : 'border-[#E8DDCD] text-[#1E1C1A] hover:border-[#B8945A]'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 mb-6"
          >
            <MessageCircle className="w-4 h-4" />
            <span>INQUIRE VIA WHATSAPP CONCIERGE</span>
          </a>

          <div className="flex items-center justify-around pt-4 border-t border-[#E8DDCD] text-[10px] text-[#5C574F] uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[#B8945A]" /> Insured Delivery</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#B8945A]" /> Lifetime Care</span>
            <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-[#B8945A]" /> Easy Exchange</span>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1E1C1A] mb-8 text-center">You May Also Admire</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id || p.slug}
                product={p}
                isWishlisted={wishlist.some((w) => w.id === p.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={(prod) => navigate(`/product/${prod.slug}`)}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
