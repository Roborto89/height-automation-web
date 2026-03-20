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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex h-screen bg-slate-950 overflow-hidden relative">
      <Navbar />
      
      {/* Mobile Sidebar Toggle - Only visible on small screens when sidebar is closed */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed bottom-6 right-6 z-40 bg-sky-500 text-slate-950 p-4 rounded-full shadow-2xl shadow-sky-500/20 animate-in zoom-in duration-300"
        >
          <Loader2 className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      )}

      <InternalSidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false); // Close on selection on mobile
        }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto pt-[70px] px-4 md:px-0">
        {renderContent()}
      </main>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
