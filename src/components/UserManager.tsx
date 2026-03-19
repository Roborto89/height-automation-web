"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/database';
import { User } from '@/lib/mockDb';
import { Users, UserPlus, Shield, UserMinus, CheckCircle2, Loader2, Mail, BadgeCheck } from 'lucide-react';

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await db.getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch personnel log:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setIsUpdating(userId);
    try {
      // Simulation for now - in production this would call db.updateUser
      await new Promise(resolve => setTimeout(resolve, 800));
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: !currentStatus } : u));
    } finally {
      setIsUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-700">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Accessing Personnel Registry...</p>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-display tracking-tight uppercase text-white">Personnel <span className="text-sky-400">Registry</span></h1>
          <p className="text-slate-500 text-sm font-medium tracking-wide">Manage administrative access and deployment permissions.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 h-12 px-6 group">
          <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Provision New User
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <div key={user.id} className="glass p-6 bg-slate-900/30 border-white/5 flex items-center justify-between group hover:border-sky-500/20 transition-all">
            <div className="flex items-center gap-6">
              <div className="relative">
                 <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-sky-500/40 transition-colors">
                    <span className="text-xl font-black text-sky-500">{user.name.charAt(0)}</span>
                 </div>
                 {user.active && (
                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-lg" />
                 )}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-sky-400 transition-colors">{user.name}</h3>
                  {user.role === 'ADMIN' && <BadgeCheck className="w-4 h-4 text-sky-400" />}
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {user.email}</span>
                  <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> {user.role}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right px-4 border-r border-white/5 space-y-1">
                 <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none">Status</p>
                 <p className={`text-[10px] font-black uppercase tracking-tighter ${user.active ? 'text-emerald-500' : 'text-slate-700'}`}>
                    {user.active ? 'OPERATIONAL' : 'DEACTIVATED'}
                 </p>
              </div>

              <button 
                onClick={() => toggleUserStatus(user.id, user.active)}
                disabled={isUpdating === user.id}
                className={`p-3 rounded-xl transition-all border ${
                  user.active 
                  ? 'bg-red-500/5 border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' 
                  : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                }`}
              >
                {isUpdating === user.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : user.active ? (
                  <UserMinus className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
