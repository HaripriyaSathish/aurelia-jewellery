import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-24 sm:py-28 bg-[#F8F5F0]">
      <div className="w-full max-w-md bg-[#FFFDF9] border border-[#E8DDCD] p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#B8945A]/10 border border-[#B8945A] text-[#B8945A] mb-4">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1E1C1A] mb-2">Forgot Password</h1>
          <p className="text-xs text-[#5C574F]">Enter your email and we'll send you a reset link.</p>
        </div>

        {sent ? (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#B8945A] mx-auto" />
            <p className="text-sm text-[#1E1C1A]">
              If an account exists for <strong>{email}</strong>, a password reset link has been sent.
            </p>
            <p className="text-xs text-[#5C574F]">Please check your inbox (and spam folder).</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#B8945A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-[#5C574F] mt-6">
          <Link to="/login" className="text-[#B8945A] font-semibold hover:text-[#1E1C1A] transition-colors">
            Back to Sign In
          </Link>
        </p>
      </div>
    </section>
  );
}
