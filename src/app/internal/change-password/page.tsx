"use client";

import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { KeyRound, Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    
    if (result.success) {
      router.push('/internal/dashboard');
    } else {
      setError(result.message || "Failed to update password");
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-mono uppercase tracking-widest text-xs animate-pulse">
        Checking clearance levels...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-sky-500 shadow-[0_4px_20px_rgba(16,185,129,0.3)]" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-500/10 blur-[100px] rounded-full" />

      <div className="w-full max-w-md glass p-10 space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-500 border-emerald-500/20">
        <header className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/30">
             <KeyRound className="text-emerald-400 w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight uppercase">
            Initialize <span className="text-emerald-400">Security</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Update Your Access Credentials</p>
        </header>

        <div className="bg-slate-900/50 border border-emerald-500/30 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-wider">Verification Successful</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed italic">
            Welcome, <strong>{user.name.split(' ')[0]}</strong>. For security compliance, you must establish a personal password before accessing the terminal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded-lg text-center animate-shake font-bold uppercase tracking-tight flex items-center justify-center gap-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">New Terminal Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  placeholder="MIN. 8 CHARACERS"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Confirm Identity</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  placeholder="REPEAT PASSWORD"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                FINALIZE SETUP
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
