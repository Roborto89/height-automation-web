"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/database';
import { CalendarEvent, User, Project } from '@/lib/mockDb';
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
  Loader2,
  CheckCircle2,
  ShieldCheck
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
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string>('all');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editType, setEditType] = useState<'MILESTONE' | 'TASK' | 'DEADLINE'>('TASK');
  const [editDate, setEditDate] = useState('');
  const [editAssignee, setEditAssignee] = useState('');
  const [editProject, setEditProject] = useState('');
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'MILESTONE' | 'TASK' | 'DEADLINE'>('TASK');
  const [newDate, setNewDate] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newProjectName, setNewProjectName] = useState(''); // For creating new projects
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchPersonnel();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [currentProjectId]);

  const fetchProjects = async () => {
    try {
      const data = await db.getProjects();
      setProjects(data);
      if (data.length > 0 && !newProject) {
        setNewProject(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await db.getCalendarEvents(currentProjectId === 'all' ? undefined : currentProjectId);
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
        status: 'PENDING',
        assignedTo: newAssignee || undefined,
        projectId: newProject || undefined,
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

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;
    try {
      setSubmitting(true);
      await db.addProject({
        name: newProjectName,
        description: newProjectDesc,
        status: 'ACTIVE'
      });
      setNewProjectName('');
      setNewProjectDesc('');
      setIsProjectModalOpen(false);
      fetchProjects();
    } catch (error) {
      alert('Project initialization failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !editTitle || !editDate) return;

    try {
      setSubmitting(true);
      await db.updateCalendarEvent(selectedEvent.id, {
        title: editTitle,
        description: editDesc,
        startDate: new Date(editDate).toISOString(),
        type: editType,
        assignedTo: editAssignee || undefined,
        projectId: editProject || undefined
      });
      
      setIsEditing(false);
      setSelectedEvent(null);
      fetchEvents();
    } catch (error) {
      alert('System update failed.');
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
                onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                className={`text-[9px] font-bold px-2 py-1 rounded border flex items-center gap-1 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(14,165,233,0.2)] active:scale-[0.98] ${
                  event.type === 'MILESTONE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  event.type === 'DEADLINE' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  'bg-sky-500/10 text-sky-400 border-sky-500/20'
                }`}
              >
                {event.type === 'MILESTONE' && <Trophy className="w-2.5 h-2.5" />}
                {event.type === 'DEADLINE' && <AlertCircle className="w-2.5 h-2.5" />}
                <span className={`truncate uppercase tracking-tighter flex-1 ${event.status === 'VERIFIED' ? 'line-through opacity-40' : ''}`}>
                  {event.title}
                </span>

                {event.status === 'COMPLETED' && (
                  <div className="flex items-center gap-1 shrink-0" title="Awaiting Admin Review">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                    <span className="text-[6px] font-black text-sky-500 uppercase">Review</span>
                  </div>
                )}
                
                {event.assignedTo && (
                  <div className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[7px] font-black shrink-0 border border-white/10" title={`Assigned: ${personnel.find(p => p.id === event.assignedTo)?.name || 'Team'}`}>
                    {personnel.find(p => p.id === event.assignedTo)?.name.split(' ').map(n => n[0]).join('') || '?'}
                  </div>
                )}
                
                <div className="flex items-center gap-1 ml-1 shrink-0">
                  {/* Personnel 'Complete' Action */}
                  {event.status === 'PENDING' && (event.assignedTo === user.id || user.role === 'ADMIN') && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); db.updateCalendarEventStatus(event.id, 'COMPLETED').then(fetchEvents); }}
                      className="p-1 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-colors border border-emerald-500/20"
                      title="Mark as Completed"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </button>
                  )}

                  {/* Admin 'Verify' Action */}
                  {event.status === 'COMPLETED' && (user.role === 'ADMIN' || user.role === 'MANAGER') && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); db.updateCalendarEventStatus(event.id, 'VERIFIED', user.id).then(fetchEvents); }}
                      className="p-1 hover:bg-amber-500/20 text-amber-500 rounded-lg transition-colors border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                      title="Admin Verification"
                    >
                      <ShieldCheck className="w-2.5 h-2.5" />
                    </button>
                  )}

                  {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); db.deleteCalendarEvent(event.id).then(fetchEvents); }}
                      className="p-1 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
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
          {/* Project Switcher */}
          <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-1 shadow-2xl">
            <button 
              onClick={() => setCurrentProjectId('all')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                currentProjectId === 'all' ? 'bg-sky-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              All Ops
            </button>
            {projects.map(project => (
              <button 
                key={project.id}
                onClick={() => setCurrentProjectId(project.id)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  currentProjectId === project.id ? 'bg-sky-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                {project.name}
              </button>
            ))}
            {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
              <button 
                onClick={() => setIsProjectModalOpen(true)}
                className="p-2 hover:bg-white/5 rounded-lg text-sky-400 transition-colors border-l border-white/10 ml-1"
                title="Initialize New Project"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-1 shadow-2xl">
            <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-6 min-w-[160px] text-center">
              <span className="text-[10px] font-black tracking-widest uppercase">
                {monthNames[currentDate.getMonth()]} <span className="text-sky-400">{currentDate.getFullYear()}</span>
              </span>
            </div>
            <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
            <button 
              onClick={() => {
                setNewProject(currentProjectId === 'all' ? (projects[0]?.id || '') : currentProjectId);
                setIsModalOpen(true);
              }}
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

      {/* Event Modal (Creation) */}
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

              <div className="grid grid-cols-2 gap-6">
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
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Parent Project Authority</label>
                  <select 
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-sky-500 transition-all shadow-inner appearance-none uppercase tracking-widest"
                    required
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
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

      {/* Detail Modal */}
      {/* Project Initialization Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsProjectModalOpen(false)} />
          <div className="relative w-full max-w-md glass bg-slate-900 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl animate-in zoom-in duration-300">
            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tighter italic">Initialize <span className="text-sky-400 not-italic">Project</span></h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">New Operation Framework</p>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Identifier</label>
                <input 
                  type="text"
                  required
                  placeholder="E.G., VISION UPGRADE PHASE 2"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold placeholder:text-slate-700 text-white focus:outline-none focus:border-sky-500 transition-all uppercase shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Strategic Description</label>
                <textarea 
                  placeholder="PROJECT SCOPE AND DURATION..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold placeholder:text-slate-700 text-white focus:outline-none focus:border-sky-500 transition-all min-h-[80px] uppercase shadow-inner"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsProjectModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-white/5 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-sky-500 text-slate-950 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-sky-500/20"
                >
                  {submitting ? 'Initializing...' : 'Authorize Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advanced Management Terminal (Detail/Edit) */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => { setSelectedEvent(null); setIsEditing(false); }} />
          
          <form onSubmit={handleUpdateEvent} className="relative w-full max-w-2xl glass bg-slate-900 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
            {/* Glow Header */}
            <div className={`h-1.5 w-full ${
              (isEditing ? editType : selectedEvent.type) === 'MILESTONE' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' :
              (isEditing ? editType : selectedEvent.type) === 'DEADLINE' ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]' :
              'bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.5)]'
            }`} />

            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-3 rounded-2xl ${
                  (isEditing ? editType : selectedEvent.type) === 'MILESTONE' ? 'bg-emerald-500/10 text-emerald-400' :
                  (isEditing ? editType : selectedEvent.type) === 'DEADLINE' ? 'bg-rose-500/10 text-rose-400' :
                  'bg-sky-500/10 text-sky-400'
                }`}>
                  {(isEditing ? editType : selectedEvent.type) === 'MILESTONE' ? <Trophy className="w-6 h-6" /> : 
                   (isEditing ? editType : selectedEvent.type) === 'DEADLINE' ? <AlertCircle className="w-6 h-6" /> : 
                   <Target className="w-6 h-6" />}
                </div>
                <div className="space-y-1 flex-1">
                  {isEditing ? (
                    <input 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2 text-2xl font-black uppercase tracking-tighter italic focus:border-sky-500 outline-none"
                    />
                  ) : (
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">{selectedEvent.title}</h2>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Personnel Record Protocol</span>
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                      <div className={`w-1 h-1 rounded-full ${
                        selectedEvent.status === 'VERIFIED' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' :
                        selectedEvent.status === 'COMPLETED' ? 'bg-sky-500 animate-pulse' :
                        'bg-slate-500'
                      }`} />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                        {selectedEvent.status || 'PENDING'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => { setSelectedEvent(null); setIsEditing(false); }}
                className="p-2 hover:bg-white/10 rounded-xl text-slate-500 transition-colors ml-4"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Support</label>
                  {isEditing ? (
                    <select 
                      value={editAssignee}
                      onChange={(e) => setEditAssignee(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-xs font-black text-white uppercase outline-none focus:border-sky-500"
                    >
                      <option value="">UNASSIGNED</option>
                      {personnel.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  ) : (
                    <div className="flex items-center gap-3 bg-slate-950 border border-white/5 rounded-2xl px-5 py-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-sky-400 uppercase tracking-tighter">
                        {personnel.find(p => p.id === selectedEvent.assignedTo)?.name.split(' ').map(n => n[0]).join('') || '??'}
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase tracking-tight leading-none">
                          {personnel.find(p => p.id === selectedEvent.assignedTo)?.name || 'UNASSIGNED'}
                        </div>
                        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">
                          {personnel.find(p => p.id === selectedEvent.assignedTo)?.role || 'COMMUNAL ASSET'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Scheduled Timeline</label>
                  {isEditing ? (
                    <input 
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-xs font-black text-white uppercase outline-none focus:border-sky-500 [color-scheme:dark]"
                    />
                  ) : (
                    <div className="flex items-center gap-3 bg-slate-950 border border-white/5 rounded-2xl px-5 py-4">
                      <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase tracking-tight leading-none">
                          {new Date(selectedEvent.startDate).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}
                        </div>
                        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Industrial Sync Point</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Type</label>
                  {isEditing ? (
                    <select 
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-xs font-black text-white uppercase outline-none focus:border-sky-500"
                    >
                      <option value="TASK">STANDARD TASK</option>
                      <option value="MILESTONE">CRITICAL MILESTONE</option>
                      <option value="DEADLINE">PROJECT DEADLINE</option>
                    </select>
                  ) : (
                    <div className="bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {selectedEvent.type}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Parent Project Authority</label>
                  {isEditing ? (
                    <select 
                      value={editProject}
                      onChange={(e) => setEditProject(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-xs font-black text-white uppercase outline-none focus:border-sky-500"
                    >
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  ) : (
                    <div className="bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black text-sky-400 uppercase tracking-widest truncate">
                      {projects.find(p => p.id === selectedEvent.projectId)?.name || 'GENERAL OPS'}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Parameters / Brief</label>
                {isEditing ? (
                  <textarea 
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-3xl p-6 min-h-[140px] text-sm font-bold text-slate-300 uppercase outline-none focus:border-sky-500"
                  />
                ) : (
                  <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 min-h-[140px] shadow-inner relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-slate-300 text-sm leading-relaxed font-bold tracking-tight whitespace-pre-wrap uppercase">
                      {selectedEvent.description || "NO MISSION BRIEF PROVIDED FOR THIS RECORD."}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                {isEditing ? (
                  <>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-8 py-5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                    >
                      Cancel Changes
                    </button>
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="flex-[2] bg-sky-500 hover:bg-sky-400 text-slate-950 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(14,165,233,0.2)]"
                    >
                      {submitting ? 'Applying Updates...' : 'Apply System Updates'}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Stage 1: Personnel Completion */}
                    {selectedEvent.status === 'PENDING' && (selectedEvent.assignedTo === user.id || user.role === 'ADMIN') && (
                      <button 
                        type="button"
                        onClick={() => { db.updateCalendarEventStatus(selectedEvent.id, 'COMPLETED').then(() => { fetchEvents(); setSelectedEvent(null); }); }}
                        className="flex-1 flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_20_rgba(16,185,129,0.2)] active:scale-95"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Mark Finished
                      </button>
                    )}

                    {/* Stage 2: Admin Verification */}
                    {selectedEvent.status === 'COMPLETED' && (user.role === 'ADMIN' || user.role === 'MANAGER') && (
                      <button 
                        type="button"
                        onClick={() => { db.updateCalendarEventStatus(selectedEvent.id, 'VERIFIED', user.id).then(() => { fetchEvents(); setSelectedEvent(null); }); }}
                        className="flex-1 flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-950 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(245,158,11,0.2)] active:scale-95 animate-pulse"
                      >
                        <ShieldCheck className="w-5 h-5" />
                        Verify & Seal Record
                      </button>
                    )}

                    {/* Admin Edit Trigger */}
                    {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditTitle(selectedEvent.title);
                          setEditDesc(selectedEvent.description || '');
                          setEditType(selectedEvent.type);
                          setEditDate(selectedEvent.startDate.split('T')[0]);
                          setEditAssignee(selectedEvent.assignedTo || '');
                          setEditProject(selectedEvent.projectId || '');
                          setIsEditing(true);
                        }}
                        className="flex-1 px-8 py-5 bg-white/5 hover:bg-white/10 text-sky-400 rounded-2xl border border-white/10 font-black text-xs uppercase tracking-widest transition-all"
                      >
                        Edit Record
                      </button>
                    )}

                    {/* Always show delete if Admin/Manager */}
                    {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                      <button 
                        type="button"
                        onClick={() => { handleDeleteEvent(selectedEvent.id).then(() => { setSelectedEvent(null); }); }}
                        className="p-5 hover:bg-rose-500/20 text-rose-500 rounded-2xl border border-rose-500/20 transition-all active:scale-95"
                        title="Terminate Record"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
