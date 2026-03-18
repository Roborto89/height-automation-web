"use client";

import { useAuth } from "@/components/AuthContext";
import {
  Clock,
  Users,
  BarChart3,
  LogOut,
  Settings,
  ChevronRight,
  PenTool,
  LayoutGrid
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function InternalSidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'time', label: 'Time Tracking', icon: <Clock className="w-4 h-4" /> },
    { id: 'history', label: 'My Timesheets', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  if (user?.role === 'ADMIN') {
    menuItems.push(
      { id: 'users', label: 'Manage Users', icon: <Users className="w-4 h-4" /> },
      { id: 'blog', label: 'Blog Manager', icon: <PenTool className="w-4 h-4" /> },
      { id: 'media', label: 'Media Library', icon: <LayoutGrid className="w-4 h-4" /> },
      { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> }
    );
  }

  return (
    <div className="w-64 bg-slate-900 border-r border-white/5 h-screen flex flex-col pt-[70px]">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Internal Terminal</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
              activeTab === item.id
                ? "bg-sky-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </div>
            {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
          </button>
        ))}
      </nav>

      <div className="p-4 bg-slate-900/50 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5">
          <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold border border-sky-500/20">
            {user?.name?.[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate uppercase tracking-tighter">{user?.name}</p>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full mt-4 flex items-center gap-2 px-4 py-2 text-[10px] font-black text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest"
        >
          <LogOut className="w-3 h-3" />
          Terminate Session
        </button>
      </div>
    </div>
  );
}
