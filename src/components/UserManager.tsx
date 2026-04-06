"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/database';
import { User } from '@/lib/mockDb';
import { Users, UserPlus, Shield, UserMinus, CheckCircle2, Loader2, Mail, BadgeCheck } from 'lucide-react';

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<User | null>(null);

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
      await db.updateUser(userId, { active: !currentStatus });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: !currentStatus } : u));
    } finally {
      setIsUpdating(null);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    
    setIsUpdating(editingProfile.id);
    try {
      await db.updateUser(editingProfile.id, {
        title: editingProfile.title,
        bio: editingProfile.bio,
        avatarUrl: editingProfile.avatarUrl,
        name: editingProfile.name
      });
      setUsers(prev => prev.map(u => u.id === editingProfile.id ? editingProfile : u));
      setEditingProfile(null);
    } catch (err) {
      console.error("Profile update failed:", err);
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
                 <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-sky-500/40 transition-colors overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-black text-sky-500">{user.name.charAt(0)}</span>
                    )}
                 </div>
                 {user.active && (
                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-lg" />
                 )}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-sky-400 transition-colors">{user.name}</h3>
                  {user.role === 'ADMIN' && <BadgeCheck className="w-4 h-4 text-sky-400" />}
                  {user.title && <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold uppercase tracking-wider">{user.title}</span>}
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {user.email}</span>
                  <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> {user.role}</span>
                  <button 
                    onClick={() => setEditingProfile(user)}
                    className="ml-2 text-sky-500 hover:text-sky-400 font-black flex items-center gap-1"
                  >
                    EDIT BIO & TITLE
                  </button>
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

      {editingProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setEditingProfile(null)} />
           <div className="relative w-full max-w-2xl glass p-8 bg-slate-900 border-white/10 animate-in zoom-in duration-500">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-6">Modify <span className="text-sky-400">Personnel Profile</span></h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Full Name</label>
                    <input 
                      value={editingProfile.name}
                      onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Professional Title</label>
                    <input 
                      value={editingProfile.title || ''}
                      onChange={(e) => setEditingProfile({ ...editingProfile, title: e.target.value })}
                      placeholder="e.g. Chief Technical Officer"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Technical Bio</label>
                  <textarea 
                    value={editingProfile.bio || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                    placeholder="Professional expertise breakdown..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all h-32 resize-none font-medium text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Avatar URL</label>
                  <input 
                    value={editingProfile.avatarUrl || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, avatarUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold text-xs"
                  />
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                   <div className="flex items-center gap-2 mb-2">
                     <Shield className="w-4 h-4 text-sky-400" />
                     <h3 className="text-xs font-black uppercase tracking-widest text-white">Security & Access Control</h3>
                   </div>
                   
                   <div className="flex gap-4">
                     <div className="flex-1 space-y-2">
                       <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">New Temporary Password</label>
                       <input 
                         type="text"
                         id="temp-password"
                         placeholder="e.g. Height2026!"
                         className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold text-xs"
                       />
                     </div>
                     <button 
                       type="button"
                       onClick={async () => {
                         const input = document.getElementById('temp-password') as HTMLInputElement;
                         if (!input.value) return alert('Please enter a temporary password.');
                         
                         setIsUpdating(editingProfile.id);
                         try {
                           await db.resetUserPassword(editingProfile.id, input.value);
                           alert(`Security reset successful! ${editingProfile.name} will be forced to update their password on next login.`);
                           input.value = '';
                         } catch (err: any) {
                           alert(err.message || 'Security reset failed');
                         } finally {
                           setIsUpdating(null);
                         }
                       }}
                       disabled={isUpdating === editingProfile.id}
                       className="self-end px-6 h-[46px] rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold hover:bg-sky-500 hover:text-slate-950 transition-all text-xs"
                     >
                       RESET ACCESS
                     </button>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={isUpdating === editingProfile.id}
                    className="flex-1 btn-primary h-12 flex items-center justify-center gap-2"
                  >
                    {isUpdating === editingProfile.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SYNCHRONIZE PROFILE'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditingProfile(null)}
                    className="px-8 h-12 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
