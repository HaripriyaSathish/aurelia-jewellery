import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-24 sm:py-28 bg-[#F8F5F0]">
      <div className="w-full max-w-md bg-[#FFFDF9] border border-[#E8DDCD] p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#B8945A]/10 border border-[#B8945A] text-[#B8945A] mb-4">
            <LogIn className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1E1C1A] mb-2">Welcome Back</h1>
          <p className="text-xs text-[#5C574F]">
            {redirectTo === '/checkout'
              ? 'Please sign in to complete your secure checkout.'
              : 'Sign in to track orders and manage your account.'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1.5">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#B8945A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#B8945A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
              />
            </div>
            <div className="text-right mt-1.5">
              <Link to="/forgot-password" className="text-[11px] text-[#B8945A] hover:text-[#1E1C1A] transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-[#5C574F] mt-6">
          New to VETRI?{' '}
          <Link to="/register" className="text-[#B8945A] font-semibold hover:text-[#1E1C1A] transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
