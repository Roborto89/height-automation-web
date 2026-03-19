"use client";

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/database';
import { MediaItem } from '@/lib/mockDb';
import { Image as ImageIcon, Film, Plus, Trash2, Link as LinkIcon, Camera, LayoutGrid, UploadCloud, Loader2 } from 'lucide-react';

export default function MediaManager() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [category, setCategory] = useState<'ROBOTICS' | 'VISION' | 'SAFETY'>('ROBOTICS');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    db.getMedia().then(setMedia);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      // Auto-identify media type
      if (selected.type.startsWith('video/')) {
        setType('video');
      } else {
        setType('image');
      }
      
      // Auto-fill title based on original filename if currently blank
      if (!title) {
        setTitle(selected.name.split('.')[0].replace(/[-_]/g, ' '));
      }
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !url) return;
    
    setUploading(true);
    let finalUrl = url;
    
    try {
      if (file) {
        finalUrl = await db.uploadMedia(file);
      }
      
      const newItem = await db.addMedia({ title, url: finalUrl, type, category });
      setMedia([newItem as any, ...media]); // Push to top of list visually
      
      // Reset form
      setTitle('');
      setUrl('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error("Upload failed", err);
      // Depending on error logging strategy, a toast notification would be ideal here.
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await db.deleteMedia(id);
    setMedia(media.filter(m => m.id !== id));
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-700">
      <header className="space-y-1">
        <h1 className="text-3xl font-black font-display tracking-tight uppercase text-white">Visual <span className="text-sky-400">Assets</span></h1>
        <p className="text-slate-500 text-sm font-medium tracking-wide">Manage project imagery and video deployments for the public gallery.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-8 items-start">
        {/* Add Media Form */}
        <div className="glass p-8 bg-slate-900/30 space-y-6 sticky top-24">
           <h3 className="text-xs font-black uppercase tracking-widest text-sky-400 flex items-center gap-2">
              <Plus className="w-3 h-3" /> Register New Asset
           </h3>
           <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                 <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Asset Title</label>
                 <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Robot Cell Alpha"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold"
                    required
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Type</label>
                    <select 
                       value={type}
                       onChange={(e) => setType(e.target.value as any)}
                       className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none appearance-none font-bold"
                    >
                       <option value="image">Image</option>
                       <option value="video">Video</option>
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Category</label>
                    <select 
                       value={category}
                       onChange={(e) => setCategory(e.target.value as any)}
                       className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none appearance-none font-bold"
                    >
                       <option value="ROBOTICS">Robotics</option>
                       <option value="VISION">Vision</option>
                       <option value="SAFETY">Safety</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Source File or Link</label>
                 <div className="relative">
                    <input 
                       ref={fileInputRef}
                       type="file"
                       accept="image/*,video/*"
                       onChange={handleFileChange}
                       className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-sky-500 file:text-slate-950 hover:file:bg-sky-400 cursor-pointer"
                    />
                 </div>
                 <div className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest py-2">- OR PROVIDE URL -</div>
                 <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                       value={url}
                       onChange={(e) => setUrl(e.target.value)}
                       placeholder="External URL (if not uploading)"
                       className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium text-sm"
                    />
                 </div>
              </div>

              <button disabled={uploading} type="submit" className="w-full btn-primary h-14 flex items-center justify-center gap-2 font-black tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed">
                 {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                 {uploading ? 'Transmitting...' : 'Deploy Asset'}
              </button>
           </form>
        </div>

        {/* Media Grid Preview */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <LayoutGrid className="w-3 h-3" /> Live Inventory
              </h3>
              <span className="text-[10px] font-mono text-slate-600 uppercase">{media.length} Synchronized Units</span>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item) => (
                <div key={item.id} className="glass group relative aspect-[4/3] bg-slate-900/50 flex flex-col items-center justify-center p-4 border-white/5 hover:border-sky-500/30 transition-all">
                   <div className="text-slate-800 group-hover:text-sky-500/20 transition-colors">
                      {item.type === 'video' ? <Film className="w-12 h-12" /> : <ImageIcon className="w-12 h-12" />}
                   </div>
                   
                   <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 to-transparent flex items-center justify-between translate-y-2 group-hover:translate-y-0 transition-transform">
                      <div className="overflow-hidden">
                         <p className="text-xs font-bold text-white truncate uppercase tracking-tighter">{item.title}</p>
                         <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{item.category}</p>
                      </div>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              ))}
           </div>

           {media.length === 0 && (
             <div className="glass p-20 flex flex-col items-center justify-center text-center space-y-4 border-dashed opacity-50">
                <Camera className="w-12 h-12 text-slate-700" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No visual assets detected in terminal queue.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
