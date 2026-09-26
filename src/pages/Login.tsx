import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Scale, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || (user?.role === 'admin' ? '/admin' : '/account');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);
      navigate(email.includes('admin') ? '/admin' : '/account');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdmin = () => {
    setEmail('admin@aaliyantraders.com');
    setPassword('admin12345');
  };

  const handleQuickCustomer = () => {
    setEmail('customer@test.com');
    setPassword('customer12345');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-xl bg-[#111827] text-[#31AAA9] flex items-center justify-center mx-auto mb-2 border border-[#31AAA9]/30">
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-slate-900">
              Account Login
            </h1>
            <p className="text-xs text-slate-500">
              Sign in for order tracking, B2B quotes, and admin portal.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono rounded">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. yourname@domain.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-bold tracking-wider text-white bg-[#31AAA9] hover:bg-[#16706F] rounded transition-colors"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* Quick Demo Logins for Instant Testing */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 block text-center">
              Quick Test Credentials (Pre-seeded):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={handleQuickAdmin}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-center flex items-center justify-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#16706F]" />
                <span>Fill Admin</span>
              </button>
              <button
                type="button"
                onClick={handleQuickCustomer}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-center flex items-center justify-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Fill Customer</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#16706F] font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
