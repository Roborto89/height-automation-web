"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import InternalSidebar from '@/components/InternalSidebar';
import TimeDashboard from '@/components/TimeDashboard';
import BlogManager from '@/components/BlogManager';
import MediaManager from '@/components/MediaManager';
import Navbar from '@/components/Navbar';
import UserManager from '@/components/UserManager';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('time');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/internal');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing System...</p>
      </div>
    );
  }

  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'time':
        return <TimeDashboard user={user} />;
      case 'blog':
        return <BlogManager />;
      case 'media':
        return <MediaManager />;
      case 'users':
        return (
          <div className="p-10 space-y-4 animate-in fade-in duration-500">
            <h1 className="text-3xl font-black font-display tracking-tight uppercase">User <span className="text-sky-400">Management</span></h1>
            <div className="glass p-12 flex flex-col items-center justify-center text-center bg-slate-900/30 space-y-4 border-dashed">
               <ShieldAlert className="w-12 h-12 text-slate-700" />
               <p className="text-slate-500 max-w-sm">
                 The User Management module is currently being optimized for the cloud environment. Check back soon for full RBAC controls.
               </p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="p-10 space-y-4 animate-in fade-in duration-500">
            <h1 className="text-3xl font-black font-display tracking-tight uppercase">Fleet <span className="text-sky-400">Intelligence</span></h1>
             <div className="glass p-12 flex flex-col items-center justify-center text-center bg-slate-900/30 space-y-4 border-dashed">
               <ShieldAlert className="w-12 h-12 text-slate-700" />
               <p className="text-slate-500 max-w-sm">
                 Predictive maintenance and reporting modules are currently processing historical data. Access will be restored shortly.
               </p>
            </div>
          </div>
        );
      default:
        return <TimeDashboard user={user!} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Navbar />
      <InternalSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto pt-[70px]">
        {renderContent()}
      </main>
    </div>
  );
}
