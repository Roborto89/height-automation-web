"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/database';
import { CalendarEvent, User } from '@/lib/mockDb';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Clock, 
  MapPin, 
  AlertCircle,
  Trophy,
  Target,
  Trash2,
  Loader2
} from 'lucide-react';

interface CalendarManagerProps {
  user: User;
}

export default function CalendarManager({ user }: CalendarManagerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [personnel, setPersonnel] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'MILESTONE' | 'TASK' | 'DEADLINE'>('TASK');
  const [newDate, setNewDate] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchPersonnel();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await db.getCalendarEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonnel = async () => {
    try {
      const data = await db.getUsers();
      setPersonnel(data);
    } catch (error) {
      console.error('Failed to fetch personnel:', error);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    try {
      setSubmitting(true);
      await db.addCalendarEvent({
        title: newTitle,
        description: newDesc,
        startDate: new Date(newDate).toISOString(),
        type: newType,
        assignedTo: newAssignee || undefined,
        createdBy: user.id
      });
      
      setNewTitle('');
      setNewDesc('');
      setNewDate('');
      setNewAssignee('');
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      alert('Failed to establish milestone. Access denied or system error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Permanent deletion of this milestone?')) return;
    try {
      await db.deleteCalendarEvent(id);
      fetchEvents();
    } catch (error) {
      alert('Deletion failed.');
    }
  };

  // Calendar Logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  
  const generateDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startOffset = firstDayOfMonth(year, month);
    
    const days = [];
    
    // Previous month padding
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`prev-${i}`} className="h-32 border border-white/5 bg-slate-950/20" />);
    }
    
    // Actual days
    for (let day = 1; day <= totalDays; day++) {
      const dateString = new Date(year, month, day).toISOString().split('T')[0];
      const dayEvents = events.filter(e => e.startDate.startsWith(dateString));
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      days.push(
        <div 
          key={day} 
          className={`h-32 border border-white/5 p-2 transition-colors hover:bg-white/5 relative group ${isToday ? 'bg-sky-500/5' : ''}`}
        >
          <span className={`text-[10px] font-black tracking-widest ${isToday ? 'text-sky-400' : 'text-slate-500'}`}>
            {day.toString().padStart(2, '0')}
          </span>
          
          <div className="mt-2 space-y-1 overflow-y-auto max-h-20 scrollbar-hide">
            {dayEvents.map(event => (
              <div 
                key={event.id}
                className={`text-[9px] font-bold px-2 py-1 rounded border flex items-center gap-1 cursor-pointer transition-transform hover:scale-[1.02] ${
                  event.type === 'MILESTONE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  event.type === 'DEADLINE' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  'bg-sky-500/10 text-sky-400 border-sky-500/20'
                }`}
              >
                {event.type === 'MILESTONE' && <Trophy className="w-2.5 h-2.5" />}
                {event.type === 'DEADLINE' && <AlertCircle className="w-2.5 h-2.5" />}
                <span className="truncate uppercase tracking-tighter flex-1">{event.title}</span>
                
                {event.assignedTo && (
                  <div className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[7px] font-black shrink-0 border border-white/10" title={`Assigned: ${personnel.find(p => p.id === event.assignedTo)?.name || 'Team'}`}>
                    {personnel.find(p => p.id === event.assignedTo)?.name.split(' ').map(n => n[0]).join('') || '?'}
                  </div>
                )}
                
                {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                    className="ml-auto opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 p-0.5"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sky-400 mb-2">
            <CalendarIcon className="w-5 h-5" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase">Operations Terminal</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none italic">
            Project <span className="text-sky-400 not-italic">Calendar</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium tracking-tight max-w-lg">
            Synchronized fleet timeline for industrial integration milestones and safety deadlocks.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-1 shadow-2xl">
            <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-6 min-w-[200px] text-center">
              <span className="text-xs font-black tracking-widest uppercase">
                {monthNames[currentDate.getMonth()]} <span className="text-sky-400">{currentDate.getFullYear()}</span>
              </span>
            </div>
            <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-sky-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              New Milestone
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="h-[600px] glass rounded-3xl border border-white/5 bg-slate-900/30 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Querying Timeline...</span>
        </div>
      ) : (
        <div className="glass rounded-3xl border border-white/10 bg-slate-900/20 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-7 border-b border-white/10 bg-slate-950/40">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="py-4 text-center">
                <span className="text-[10px] font-black text-slate-500 tracking-widest">{day}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {generateDays()}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-8 px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Milestones</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Tasks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadlines</span>
        </div>
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !submitting && setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-xl glass bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Establish <span className="text-sky-400 not-italic">Milestone</span></h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">Temporal Synchronization Protocol</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full text-slate-500 transition-colors"
                disabled={submitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Authority / Title</label>
                <input 
                  type="text"
                  required
                  placeholder="E.G., ROBOTIC CELL 04 GO-LIVE"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold placeholder:text-slate-700 text-white focus:outline-none focus:border-sky-500 transition-all uppercase tracking-tight shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Scheduled Sync Date</label>
                  <input 
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-sky-500 transition-all shadow-inner [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Type</label>
                  <select 
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-sky-500 transition-all shadow-inner appearance-none uppercase tracking-widest"
                  >
                    <option value="TASK">STANDARD TASK</option>
                    <option value="MILESTONE">CRITICAL MILESTONE</option>
                    <option value="DEADLINE">PROJECT DEADLINE</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assign To Personnel</label>
                <select 
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-sky-500 transition-all shadow-inner appearance-none uppercase tracking-widest"
                >
                  <option value="">COMMUNAL / UNASSIGNED</option>
                  {personnel.filter(p => p.active).map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description / Brief</label>
                <textarea 
                  placeholder="PROVIDE TECHNICAL PARAMETERS OR MISSION OBJECTIVES..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold placeholder:text-slate-700 text-white focus:outline-none focus:border-sky-500 transition-all min-h-[120px] uppercase tracking-tight shadow-inner"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-white/5 bg-slate-950/20"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_10px_20px_rgba(14,165,233,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Establishing...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4" />
                      Initiate Record
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
