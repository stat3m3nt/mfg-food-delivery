
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}
      style={{ background: '#fff', borderBottom: '1px solid #f0e6d3' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full" style={{ background: '#c8410a', opacity: 0.12 }} />
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
              <path d="M10 0C13 5 17 9 16 13C15 17 18 19 16 23C14 27 11 28 10 28C9 28 6 27 4 23C2 19 5 17 4 13C3 9 7 5 10 0Z" fill="#f97316"/>
              <path d="M10 6C12 10 14 12 13 15C12 18 14 20 12 23C11 25 10 26 10 26C10 26 9 25 8 23C6 20 8 18 7 15C6 12 8 10 10 6Z" fill="#fbbf24"/>
            </svg>
          </div>
          <div>
            <span className="font-black tracking-widest text-xl" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#1a0800' }}>
              MFG
            </span>
            <p className="text-xs leading-none" style={{ color: '#8a6a50', letterSpacing: '0.1em' }}>
              Mac&apos;s Fried Goods
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/menu" style={{ color: '#8a6a50', fontSize: '14px', fontWeight: 500 }}>Menu</Link>
          <Link href="/about" style={{ color: '#8a6a50', fontSize: '14px', fontWeight: 500 }}>About</Link>
          <Link
            href="/menu"
            className="px-5 py-2 rounded-full text-white font-semibold text-sm transition-all hover:scale-105"
            style={{ background: '#f97316' }}
          >
            Order Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
