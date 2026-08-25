import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, Phone, Compass, User } from 'lucide-react';
import logoImg from '../assets/vetri-logo.jpg';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  wishlistCount = 0,
  cartCount = 0,
  onOpenSearch,
  onOpenWishlist,
  onOpenCart,
  settings
}) {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '/#home' },
    { name: 'COLLECTIONS', href: '/#collections' },
    { name: 'OUR STORY', href: '/#story' },
    { name: 'JOURNAL', href: '/#campaign' },
    { name: 'CONTACT', href: '/#contact' },
    { name: 'TRACK ORDER', href: '/order-tracking' },
  ];

  return (
    <>
            <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#FFFDF9]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-b border-[#E8DDCD]/80 py-1.5'
            : 'bg-gradient-to-b from-black/60 via-black/25 to-transparent text-white py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`p-2 transition-colors ${
                isScrolled ? 'text-[#1E1C1A] hover:text-[#B8945A]' : 'text-white hover:text-[#E8DDCD]'
              }`}
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/" className="inline-flex items-center group">
                <img
                src={logoImg}
                alt="Vetri Jewelers"
                className="h-16 sm:h-20 lg:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

                   {/* Centered Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isHash = link.href.startsWith('/#');
              const linkClass = `text-[12px] font-medium tracking-[0.25em] transition-all duration-300 relative group py-1 ${
                isScrolled ? 'text-[#1E1C1A] hover:text-[#B8945A]' : 'text-white/90 hover:text-white'
              }`;
              return isHash ? (
                <a key={link.name} href={link.href} className={linkClass}>
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#B8945A] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ) : (
                <Link key={link.name} to={link.href} className={linkClass}>
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#B8945A] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-5 sm:space-x-7">

            {/* Account Trigger */}
            <Link
              to={user ? '/account' : '/login'}
              className={`flex items-center gap-1.5 transition-colors hover:scale-105 duration-200 ${
                isScrolled ? 'text-[#1E1C1A] hover:text-[#B8945A]' : 'text-white hover:text-[#E8DDCD]'
              }`}
              title={user ? 'My Account' : 'Sign In'}
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              {user && (
                <span className="hidden lg:inline text-[11px] font-medium tracking-wider whitespace-nowrap">
                  Hi, {user.first_name || 'there'}
                </span>
              )}
            </Link>

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className={`p-1.5 transition-colors hover:scale-105 duration-200 ${
                isScrolled ? 'text-[#1E1C1A] hover:text-[#B8945A]' : 'text-white hover:text-[#E8DDCD]'
              }`}
              title="Search Collection"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={onOpenWishlist}
              className={`p-1.5 relative transition-colors hover:scale-105 duration-200 ${
                isScrolled ? 'text-[#1E1C1A] hover:text-[#B8945A]' : 'text-white hover:text-[#E8DDCD]'
              }`}
              title="View Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B8945A] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className={`p-1.5 relative transition-colors hover:scale-105 duration-200 ${
                isScrolled ? 'text-[#1E1C1A] hover:text-[#B8945A]' : 'text-white hover:text-[#E8DDCD]'
              }`}
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1E1C1A] text-[#E8DDCD] border border-[#B8945A] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FFFDF9] shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#E8DDCD]">
                <div>
                  <img src={logoImg} alt="Vetri Jewelers" className="h-16 w-auto object-contain" />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#5C574F] hover:text-[#1E1C1A] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-8 space-y-5">
                {navLinks.map((link) => {
                  const isHash = link.href.startsWith('/#');
                  const linkClass = "block text-sm font-medium tracking-[0.2em] text-[#1E1C1A] hover:text-[#B8945A] transition-colors py-1 border-b border-[#E8DDCD]/40";
                  return isHash ? (
                    <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className={linkClass}>
                      {link.name}
                    </a>
                  ) : (
                    <Link key={link.name} to={link.href} onClick={() => setMobileMenuOpen(false)} className={linkClass}>
                      {link.name}
                    </Link>
                  );
                })}
                <Link
                  to={user ? '/account' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium tracking-[0.2em] text-[#1E1C1A] hover:text-[#B8945A] transition-colors py-1 border-b border-[#E8DDCD]/40"
                >
                  {user ? `HI, ${(user.first_name || 'THERE').toUpperCase()} — MY ACCOUNT` : 'SIGN IN / REGISTER'}
                </Link>
              </nav>
            </div>

            {/* Quick Actions in Mobile Menu */}
            <div className="pt-6 border-t border-[#E8DDCD] space-y-3">
              <a
                href="tel:+919876543210"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#1E1C1A] text-[#E8DDCD] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#B8945A] hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#B8945A]" />
                Call Concierge
              </a>
              <a
                href="#boutique"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-[#B8945A] text-[#1E1C1A] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#F8F5F0] transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-[#B8945A]" />
                Visit Boutique
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}