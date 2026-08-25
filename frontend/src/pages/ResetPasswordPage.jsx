import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/api';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const missingLink = !uid || !token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(uid, token, password);
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'This reset link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-24 sm:py-28 bg-[#F8F5F0]">
      <div className="w-full max-w-md bg-[#FFFDF9] border border-[#E8DDCD] p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#B8945A]/10 border border-[#B8945A] text-[#B8945A] mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1E1C1A] mb-2">Reset Password</h1>
          <p className="text-xs text-[#5C574F]">Choose a new password for your account.</p>
        </div>

        {missingLink ? (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs text-center">
            This reset link is missing information. Please use the link from your email, or request a new one.
          </div>
        ) : done ? (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#B8945A] mx-auto" />
            <p className="text-sm text-[#1E1C1A]">Your password has been reset. Redirecting to sign in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>}

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#B8945A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#B8945A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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
