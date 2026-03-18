"use client";

import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, Loader2 } from 'lucide-react';

export default function InternalLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.push('/internal/dashboard');
    } else {
      setError(result.message || "Authentication failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-indigo-500 shadow-[0_4px_20px_rgba(56,189,248,0.3)]" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full" />

      <div className="w-full max-w-md glass p-10 space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <header className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center mb-4 border border-sky-500/30">
             <Shield className="text-sky-400 w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight uppercase">
            Internal <span className="text-sky-400">Terminal</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Authorized Personnel Only</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded-lg text-center animate-pulse font-bold uppercase tracking-tight">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Access Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium"
                  placeholder="name@heightauto.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary h-14 relative overflow-hidden group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                ESTABLISH CONNECTION
              </span>
            )}
          </button>
        </form>

        <footer className="text-center pt-4 border-t border-white/5">
           <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">© 2026 Height Automation Secure Infrastructure</p>
        </footer>
      </div>
    </div>
  );
}
