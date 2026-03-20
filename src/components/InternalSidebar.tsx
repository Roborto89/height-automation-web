"use client";

import { useAuth } from "@/components/AuthContext";
import {
  Clock,
  Users,
  LogOut,
  Settings,
  ChevronRight,
  PenTool,
  FileText,
  TrendingUp,
  Image,
  LayoutDashboard
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function InternalSidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  // Replaced menuItems with navItems and updated structure
  const navItems = [
    { name: 'Time Tracking', icon: Clock, id: 'time' },
    { name: 'My Timesheets', icon: FileText, id: 'timesheets' },
    { name: 'Manage Users', icon: Users, id: 'users' },
    { name: 'Blog Manager', icon: PenTool, id: 'blog' },
    { name: 'Media Library', icon: Image, id: 'media' },
    { name: 'Reports', icon: TrendingUp, id: 'reports' },
  ];

  // Filter navItems based on user role
  const filteredNavItems = navItems.filter(item => {
    if (user?.role === 'ADMIN') {
      return true; // Admin sees all items
    } else {
      // Non-admin users only see 'Time Tracking' and 'My Timesheets'
      return item.id === 'time' || item.id === 'timesheets';
    }
  });

  return (
    <div className={`
      fixed md:relative z-40 w-64 bg-slate-900 border-r border-white/5 h-screen flex flex-col pt-[70px]
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Internal Terminal</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-1 text-slate-500 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 transition-all ${
                activeTab === item.id 
                  ? 'bg-sky-500/10 text-sky-400 border-r-2 border-sky-500' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-tight">{item.name}</span>
            </button>
          );
        })}
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
