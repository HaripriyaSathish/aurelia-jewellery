import React, { useState } from 'react';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setErrorMsg('');
    try {
      await apiService.subscribeNewsletter(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      if (err.errors && err.errors.email) {
        setErrorMsg(err.errors.email[0]);
      } else {
        setErrorMsg('Subscription could not be processed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-[#1E1C1A] text-white border-t border-[#B8945A]/20 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B8945A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#B8945A]" />
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#E8DDCD]">
            THE PRIVATE CIRCLE
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#B8945A]" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-white mb-2.5">
          A Little More Brilliance
        </h2>

        <p className="text-sm sm:text-base text-[#E8DDCD]/80 font-normal max-w-lg mx-auto mb-6 font-cormorant text-lg italic leading-relaxed">
          Be the first to receive invitations to private salon exhibitions, bespoke high jewellery releases, and private maison journals.
        </p>

        {success ? (
          <div className="inline-flex items-center gap-2.5 p-3.5 bg-white/10 backdrop-blur-md border border-[#B8945A] text-[#E8DDCD] text-xs uppercase tracking-wider animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#B8945A]" />
            <span>Welcome to the AURELIA Private Circle. A confirmation note has been dispatched.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address..."
              className="flex-1 px-3.5 py-3 bg-white/5 border border-[#E8DDCD]/30 text-sm text-white placeholder-[#E8DDCD]/50 focus:outline-none focus:border-[#B8945A] transition-colors backdrop-blur-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 bg-[#B8945A] hover:bg-[#a38048] text-white text-sm font-semibold tracking-[0.25em] uppercase transition-all duration-300 shadow-md disabled:opacity-50 flex-shrink-0"
            >
              {loading ? 'JOINING...' : 'SUBSCRIBE'}
            </button>
          </form>
        )}

        {errorMsg && (
          <div className="mt-2.5 text-red-400 text-xs flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}

      </div>
    </section>
  );
}
