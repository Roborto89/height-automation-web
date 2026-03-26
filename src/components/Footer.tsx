"use client";

import Link from "next/link";
import { Cpu, Linkedin, Mail, MapPin, Zap } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tighter">
            <Cpu className="text-sky-400 w-8 h-8" />
            <span>HEIGHT <span className="text-sky-400">AUTOMATION</span></span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
            Engineering high-availability robotic integration and custom machine vision 
            for the world's most demanding industrial environments.
          </p>
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-[0.2em]">
               <Zap className="w-3 h-3" /> V.04 Revision
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-6">
          <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Protocol</h4>
          <ul className="space-y-4">
            {[
              { name: "About", href: "/about" },
              { name: "Quote Tool", href: "/quote" },
              { name: "Gallery", href: "/gallery" },
              { name: "Blog", href: "/blog" },
              { name: "Internal Portal", href: "/internal" }
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-slate-400 hover:text-sky-400 text-sm font-medium transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Fields */}
        <div className="space-y-6">
          <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Communication</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <span className="text-slate-400 text-sm">contact@heightautomation.com</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <span className="text-slate-400 text-sm">Industrial Parkway, <br />Global HQ</span>
            </li>
            <li className="flex items-start gap-3">
              <Linkedin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <span className="text-slate-400 text-sm hover:text-sky-400 cursor-pointer transition-colors">LinkedIn Profile</span>
            </li>
          </ul>
        </div>

        {/* Newsletter / CTA */}
        <div className="space-y-6">
          <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Newsletter</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            Subscribe to receive technical bulletins and system deployment logs.
          </p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Engineering Email" 
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-sky-500/50 transition-colors"
            />
            <button className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg transition-all">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] uppercase font-black tracking-widest">
        <p>© {currentYear} Height Automation LLC. All Rights Reserved.</p>
        <div className="flex gap-8">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          <span className="text-sky-500/50">Secure Deployment</span>
        </div>
      </div>
    </footer>
  );
}
