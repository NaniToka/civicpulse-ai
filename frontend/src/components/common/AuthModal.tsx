import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, MapPin, ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import { Region } from '../../types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  isVerified: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  regions?: Region[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  regions = [],
}) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState(regions[0]?.district_city || 'Kanpur South Belt');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in your name, email, and password.');
        return;
      }
    } else if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const userObj: UserProfile = {
        id: `USR-${Date.now().toString().slice(-6)}`,
        name: name.trim() || email.split('@')[0] || 'Rajesh Kumar',
        email: email.trim(),
        phone: phone.trim() || '+91 98765 43210',
        district: district || 'Kanpur South Belt',
        isVerified: true,
      };

      try {
        localStorage.setItem('civicpulse_user_session', JSON.stringify(userObj));
      } catch {
        // ignore
      }

      onLoginSuccess(userObj);
      setLoading(false);
      onClose();
    }, 600);
  };

  const handleDemoQuickLogin = () => {
    const demoUser: UserProfile = {
      id: 'USR-894102',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@civicpulse.org',
      phone: '+91 98765 43210',
      district: 'Kanpur South Belt',
      isVerified: true,
    };
    try {
      localStorage.setItem('civicpulse_user_session', JSON.stringify(demoUser));
    } catch {
      // ignore
    }
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0A0A0C] border border-white/[0.16] rounded-2xl shadow-2xl overflow-hidden text-slate-100 font-bold space-y-6">
        {/* Header Banner */}
        <div className="p-6 border-b border-white/[0.12] bg-[#121215] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              {mode === 'signup' ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                {mode === 'signup' ? 'Create Citizen Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-slate-400 font-normal">
                {mode === 'signup' ? 'Sign up to raise complaints & track resolution' : 'Log in to your verified citizen portal'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 flex border-b border-white/[0.08] font-mono text-sm">
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 text-center border-b-2 font-extrabold transition cursor-pointer ${
              mode === 'signup' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            New User (Sign Up)
          </button>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-center border-b-2 font-extrabold transition cursor-pointer ${
              mode === 'login' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Existing User (Log In)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-slate-300 font-extrabold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121215] border border-white/[0.12] text-white focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-slate-300 font-extrabold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. citizen@civicpulse.org"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121215] border border-white/[0.12] text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          {mode === 'signup' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate-300 font-extrabold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121215] border border-white/[0.12] text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate-300 font-extrabold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  Your District / Location *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121215] border border-white/[0.12] text-white focus:outline-none focus:border-indigo-500 font-sans cursor-pointer"
                >
                  <option value="Kanpur South Belt">Kanpur South Belt, UP</option>
                  <option value="Vijayawada Amaravati Corridor">Vijayawada Amaravati Corridor, AP</option>
                  <option value="Pune Peri-Urban Ward 12">Pune Peri-Urban Ward 12, MH</option>
                  <option value="North Chennai Coastal Ward">North Chennai Coastal Ward, TN</option>
                  <option value="Ekurhuleni North Clinic Sector">Ekurhuleni North, SA</option>
                  <option value="Salvador Baixada Zone">Salvador Baixada Zone, BR</option>
                </select>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-slate-300 font-extrabold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121215] border border-white/[0.12] text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg font-sans"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : mode === 'signup' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Continue</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In to Account</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDemoQuickLogin}
              className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>One-Click Quick Sign In as Verified Citizen (Demo)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
