"use client";

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/database';
import { User, TimeEntry } from '@/lib/mockDb';
import { Play, Square, Clock, Calendar, FileText, CheckCircle2, Loader2 } from 'lucide-react';

export default function TimeDashboard({ user }: { user: User }) {
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notes, setNotes] = useState('');
  const [stats, setStats] = useState({ today: 0, week: 0 });
  const [success, setSuccess] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const allEntries = await db.getTimeEntries(user.id);
      const active = allEntries.find(e => !e.clockOutAt);
      
      setActiveEntry(active || null);
      setEntries(allEntries.slice(0, 5));

      // Simple stats calculation (simulated hours)
      const todayCount = allEntries.filter(e => 
        e.clockInAt.includes(new Date().toISOString().split('T')[0])
      ).length;
      
      setStats({ 
        today: todayCount * 8, 
        week: todayCount * 8 + 32 
      });
    } catch (err) {
      console.error("Failed to load time data:", err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClockToggle = async () => {
    setIsSyncing(true);
    try {
      if (activeEntry) {
        await db.clockOut(user.id);
      } else {
        await db.clockIn(user.id, notes);
        setNotes('');
      }
      setSuccess(true);
      await loadData();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Shift transition failed:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Syncing shift data...</p>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-display tracking-tight uppercase text-white">Time <span className="text-sky-400">Command</span></h1>
          <p className="text-slate-500 text-sm font-medium tracking-wide italic">"Precision automation isn't just about speed; it's about consistency."</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass px-6 py-3 bg-slate-900/50 flex items-center gap-4 border-white/5">
            <div className="p-2 bg-sky-500/10 rounded-lg"><Clock className="w-4 h-4 text-sky-400" /></div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Today's Log</p>
              <p className="text-xl font-bold font-display">{stats.today} <span className="text-xs text-slate-500">HRS</span></p>
            </div>
          </div>
          <div className="glass px-6 py-3 bg-slate-900/50 flex items-center gap-4 border-white/5">
            <div className="p-2 bg-emerald-500/10 rounded-lg"><Calendar className="w-4 h-4 text-emerald-400" /></div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Week View</p>
              <p className="text-xl font-bold font-display">{stats.week} <span className="text-xs text-slate-500">HRS</span></p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Main Terminal */}
        <div className="glass relative overflow-hidden bg-slate-900/40 p-10 flex flex-col items-center justify-center text-center space-y-8 min-h-[450px]">
          {activeEntry ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full" />
                <div className="relative w-24 h-24 bg-sky-500/10 rounded-full border-2 border-sky-500/50 flex items-center justify-center mx-auto shadow-2xl shadow-sky-500/20">
                  <Loader2 className="w-10 h-10 text-sky-400 animate-spin-slow" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-5xl font-black font-display tracking-tighter uppercase italic">Active <span className="text-sky-400">Shift</span></h2>
                <p className="text-slate-400 font-mono text-sm tracking-widest">TRANSMISSION ESTABLISHED SINCE {new Date(activeEntry.clockInAt).toLocaleTimeString()}</p>
              </div>
              <button 
                onClick={handleClockToggle}
                disabled={isSyncing}
                className="group w-64 h-16 bg-red-500 hover:bg-red-600 text-white rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95"
              >
                {isSyncing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Square className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                Terminate Shift
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
               <div className="w-20 h-20 bg-slate-950 rounded-3xl border border-white/5 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-slate-800" />
               </div>
               <div className="space-y-2">
                 <h2 className="text-5xl font-black font-display tracking-tighter uppercase opacity-40">System <span className="text-slate-700">Standby</span></h2>
                 <p className="text-slate-600 font-bold uppercase tracking-[0.3em] text-[10px]">No Active Link Detected</p>
               </div>
               
               <div className="max-w-xs mx-auto space-y-4">
                  <div className="relative group">
                    <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-600 group-focus-within:text-sky-400 transition-colors" />
                    <textarea 
                      placeholder="Brief report on current objectives..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all h-24 resize-none font-medium text-sm"
                    />
                  </div>
                  <button 
                    onClick={handleClockToggle}
                    disabled={isSyncing}
                    className="group w-full h-16 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase tracking-widest shadow-xl shadow-sky-500/20 active:scale-95"
                  >
                    {isSyncing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 fill-current group-hover:translate-x-1 transition-transform" />}
                    Initiate Shift
                  </button>
               </div>
            </div>
          )}

          {success && (
            <div className="absolute top-8 right-8 animate-in fade-in slide-in-from-right-4">
              <div className="glass px-4 py-2 bg-emerald-500/10 border-emerald-500/50 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">System Synchronized</span>
              </div>
            </div>
          )}
        </div>

        {/* History Log */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Operation Logs</h3>
            <span className="text-[8px] font-mono text-slate-700 uppercase">Latest 5 Transmissions</span>
          </div>
          
          <div className="space-y-4">
            {entries.length === 0 ? (
               <div className="glass p-12 text-center opacity-30 border-dashed">
                  <p className="text-[10px] font-black uppercase tracking-widest">Log Queue Empty</p>
               </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="glass group p-5 bg-slate-900/30 border-white/5 hover:border-sky-500/20 transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      <span className="text-xs font-bold text-white uppercase tracking-tight">Shift Sequence</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 italic">{new Date(entry.clockInAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[8px] uppercase font-black text-slate-600 tracking-widest">Duration Profile</p>
                      <p className="text-sm font-bold font-mono">
                        {new Date(entry.clockInAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                        <span className="text-slate-700 mx-2">→</span> 
                        {entry.clockOutAt ? new Date(entry.clockOutAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'ACTIVE'}
                      </p>
                    </div>
                    {entry.notes && (
                       <div className="p-2 bg-white/5 rounded-lg group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                          <FileText className="w-3 h-3" />
                       </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
