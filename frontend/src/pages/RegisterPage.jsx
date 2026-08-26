import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(data.errors);
      } else {
        setErrors({ non_field_errors: ['Something went wrong. Please try again.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (field) => errors[field]?.[0];

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-24 sm:py-28 bg-[#F8F5F0]">
      <div className="w-full max-w-md bg-[#FFFDF9] border border-[#E8DDCD] p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#B8945A]/10 border border-[#B8945A] text-[#B8945A] mb-4">
            <UserPlus className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1E1C1A] mb-2">Create Your Account</h1>
          <p className="text-xs text-[#5C574F]">Join VETRI to checkout faster and track your orders.</p>
        </div>

        {errors.non_field_errors && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">{errors.non_field_errors[0]}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#B8945A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Lady Penelope"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
              />
            </div>
          </div>

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
            {fieldError('email') && <p className="text-[11px] text-red-600 mt-1">{fieldError('email')}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#B8945A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
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
                placeholder="At least 8 characters"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
              />
            </div>
            {fieldError('password') && <p className="text-[11px] text-red-600 mt-1">{fieldError('password')}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-[#5C574F] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#B8945A] font-semibold hover:text-[#1E1C1A] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
