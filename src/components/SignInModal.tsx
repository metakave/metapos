import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Mail, ArrowRight, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { api, errorMessage, type User } from '../lib/api';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDemo: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onOpenDemo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Show the signed-in state if a session already exists.
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    api<{ user: User | null }>('/auth/me')
      .then(({ user }) => setUser(user))
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { user } = await api<{ user: User }>('/auth/login', {
        method: 'POST',
        body: { identifier: email, password },
      });
      setPassword('');
      if (user.role === 'admin') {
        onClose();
        navigate('/admin');
        return;
      }
      setUser(user);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B192C]/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#0B192C]/10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0B192C]/10 bg-[#0B192C] text-white">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#064E3B] text-white flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-emerald-300" />
            </div>
            <span className="text-sm font-bold text-white">MetaPOS প্রকাশক লগইন</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-300 hover:text-white rounded-lg" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {user ? (
          <div className="p-8 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h4 className="text-lg font-bold text-[#0B192C]">স্বাগতম, {user.press_name || user.name}!</h4>
            <p className="text-xs text-[#0B192C]/80 font-medium">
              আপনি সফলভাবে লগইন করেছেন। অ্যাকাউন্ট সম্পর্কিত যেকোনো সহায়তার জন্য আমাদের বাংলা সাপোর্ট টিম পাশে আছে।
            </p>
            <div className="flex items-center justify-center gap-2">
              {user.role === 'admin' && (
                <button
                  onClick={() => {
                    onClose();
                    navigate('/admin');
                  }}
                  className="mt-2 rounded-xl bg-[#064E3B] px-6 py-2.5 text-xs font-bold text-white"
                >
                  ড্যাশবোর্ডে প্রবেশ করুন
                </button>
              )}
              <button
                onClick={onClose}
                className={`mt-2 rounded-xl px-6 py-2.5 text-xs font-bold ${
                  user.role === 'admin' ? 'border border-[#0B192C]/20 text-[#0B192C]' : 'bg-[#064E3B] text-white'
                }`}
              >
                ঠিক আছে
              </button>
            </div>
            <button onClick={handleLogout} className="text-[11px] font-bold text-[#831843] hover:underline">
              লগআউট করুন
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#0B192C] mb-1">প্রকাশনী অ্যাকাউন্ট ইমেইল বা মোবাইল</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
                <input
                  type="text"
                  required
                  placeholder="editor@press.com.bd অথবা 017xxxxxxxx"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#0B192C]/20 py-2 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-bold text-[#0B192C]">পাসওয়ার্ড</label>
                <span className="text-[11px] font-bold text-[#831843]">ভুলে গেছেন? সাপোর্টে যোগাযোগ করুন</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#0B192C]/20 py-2 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-[#831843]/30 bg-[#FDF2F8] p-2.5 text-[11px] font-semibold text-[#831843]"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#064E3B] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#043E2F] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{loading ? 'যাচাই করা হচ্ছে…' : 'লগইন করুন'}</span>
              {!loading && <ArrowRight className="h-3.5 w-3.5 text-amber-300" />}
            </button>

            <div className="pt-2 text-center text-[11px] text-[#0B192C]/70 border-t border-[#0B192C]/10 font-medium">
              আপনার প্রকাশনীর অ্যাকাউন্ট নেই?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDemo();
                }}
                className="font-bold text-[#064E3B] hover:underline"
              >
                ফ্রি ডেমো বুক করুন
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
