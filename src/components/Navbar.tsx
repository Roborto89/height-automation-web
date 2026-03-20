"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Quote Tool", href: "/quote" },
    { name: "Gallery", href: "/gallery" },
    { name: "Blog", href: "/blog" },
    { name: "Internal Portal", href: "/internal" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full h-[70px] bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 md:px-8 z-[100]">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tighter hover:opacity-80 transition-opacity">
          <Cpu className="text-sky-400 w-8 h-8" />
          <span className="hidden sm:inline">HEIGHT <span className="text-sky-400">AUTOMATION</span></span>
          <span className="sm:hidden text-sky-400">HA</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-sky-400 ${
                pathname === link.href ? "text-sky-400" : "text-slate-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[90] md:hidden">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300" />
          <div className="relative h-full flex flex-col items-center justify-center p-8 space-y-8 animate-in slide-in-from-top-10 duration-500">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-black uppercase tracking-widest transition-colors ${
                  pathname === link.href ? "text-sky-400" : "text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
