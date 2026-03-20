"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { db } from "@/lib/database";
import { MediaItem } from "@/lib/mockDb";
import { Play, Maximize2, Camera, Film, X } from "lucide-react";

export default function GalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedia = async () => {
      const data = await db.getMedia();
      setMedia(data);
      setLoading(false);
    };
    loadMedia();
  }, []);

  const categories = ['ALL', ...Array.from(new Set(media.map(m => m.category.toUpperCase())))];
  const filteredMedia = activeCategory === 'ALL' 
    ? media 
    : media.filter(m => m.category.toUpperCase() === activeCategory);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="pt-[100px] max-w-7xl mx-auto px-8 pb-20 space-y-12">
        <header className="space-y-6 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Camera className="w-3 h-3" /> Visual Archives
           </div>
           <h1 className="text-5xl md:text-6xl font-black font-display tracking-tighter uppercase leading-none">Project <span className="text-sky-400">Chronoscope</span></h1>
           <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed italic">"A mission-critical record of industrial precision and automation triumphs."</p>
        </header>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 pt-8">
           {categories.map(cat => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                 activeCategory === cat 
                 ? 'bg-sky-500 text-slate-950 border-sky-500 shadow-xl shadow-sky-500/20' 
                 : 'bg-slate-900 text-slate-500 border-white/5 hover:border-sky-500/50 hover:text-white'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="group relative glass overflow-hidden aspect-[4/5] hover:border-sky-500/50 transition-all duration-500 cursor-pointer animate-in fade-in zoom-in duration-700"
            >
              {/* Media Content - Actual Preview */}
              <div className="absolute inset-0 bg-slate-900">
                 {item.url ? (
                   item.type === 'video' ? (
                     <div className="w-full h-full relative">
                        <video 
                           src={item.url} 
                           className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                           muted
                           loop
                           onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                           onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity">
                           <Play className="w-12 h-12 text-sky-500/50" />
                        </div>
                     </div>
                   ) : (
                     <img 
                        src={item.url} 
                        className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                        alt={item.title} 
                     />
                   )
                 ) : (
                   <div className="w-full h-full flex items-center justify-center">
                      {item.type === 'video' ? <Film className="w-12 h-12 text-slate-800" /> : <Camera className="w-12 h-12 text-slate-800" />}
                   </div>
                 )}
              </div>
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end gap-2">
                <div className="flex items-center gap-3 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                   <span className="px-2 py-0.5 rounded bg-sky-500 text-[8px] font-black text-slate-950 uppercase tracking-widest leading-none">
                      {item.type}
                   </span>
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.category}</span>
                </div>
                
                <h3 className="text-2xl font-black font-display uppercase tracking-tighter leading-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                   {item.title}
                </h3>
                
                <div className="pt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                   <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-sky-500 hover:text-slate-950 transition-all">
                      <Maximize2 className="w-4 h-4" />
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expand Module</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
             <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" onClick={() => setSelectedItem(null)} />
             
             <div className="relative w-full max-w-6xl max-h-[90vh] glass bg-slate-900 rounded-3xl overflow-hidden border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 flex flex-col md:flex-row">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-slate-950/50 hover:bg-white text-white hover:text-slate-950 flex items-center justify-center transition-all"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex-1 bg-black flex items-center justify-center">
                   {selectedItem.type === 'video' ? (
                     <video src={selectedItem.url} controls autoPlay className="max-w-full max-h-full" />
                   ) : (
                     <img src={selectedItem.url} className="max-w-full max-h-full object-contain" alt={selectedItem.title} />
                   )}
                </div>

                <div className="w-full md:w-80 p-8 space-y-6 border-l border-white/5 bg-slate-900/50 overflow-y-auto">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">{selectedItem.category}</p>
                      <h2 className="text-3xl font-black font-display uppercase leading-none tracking-tight">{selectedItem.title}</h2>
                   </div>
                   
                   <div className="space-y-4 pt-4">
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-white/5 pb-4">
                         <span>Deployment ID</span>
                         <span className="text-white font-mono">{selectedItem.id.slice(0, 8)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-white/5 pb-4">
                         <span>Asset Type</span>
                         <span className="text-white">{selectedItem.type.toUpperCase()}</span>
                      </div>
                   </div>

                   <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      Captured during routine operational audits. This module represents a milestone in {selectedItem.category.toLowerCase()} integration excellence.
                   </p>

                   <div className="pt-8">
                      <button className="btn-primary w-full text-xs">Request Engineering Data</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {filteredMedia.length === 0 && (
          <div className="py-40 text-center space-y-4 opacity-30">
             <Camera className="w-16 h-16 mx-auto text-slate-700" />
             <p className="font-display text-xl font-black uppercase">Terminal Empty: No Assets Deployed</p>
          </div>
        )}
      </main>
    </div>
  );
}
