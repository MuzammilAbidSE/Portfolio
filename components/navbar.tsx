'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const links = [
  { href: '#experience', label: 'Experience' },
  { href: '#skills',     label: 'Skills' },
  { href: '#projects',   label: 'Projects' },
  { href: '#about',      label: 'About' },
  { href: '#contact',    label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-paper/95 backdrop-blur border-b border-ink/10 shadow-sm' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 lg:h-[72px] flex items-center justify-between">

        <Link href="/" className="font-display text-xl text-ink hover:text-rust transition-colors">
          MMA<span className="text-rust">.</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="font-mono text-[0.65rem] text-mist hover:text-ink uppercase tracking-[0.12em] transition-colors">
              {l.label}
            </a>
          ))}
          {/* <Link href="/admin"
            className="font-mono text-[0.65rem] border border-rust text-rust hover:bg-rust hover:text-paper px-4 py-2 tracking-[0.1em] transition-all">
            Admin
          </Link> */}
        </nav>

        {/* Hamburger */}
        <button className="lg:hidden flex flex-col gap-[5px] p-2 bg-transparent border-0 cursor-pointer"
          onClick={() => setOpen(!open)}>
          <span className={`block w-6 h-px bg-ink transition-all duration-300 ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`block w-6 h-px bg-ink transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-ink transition-all duration-300 ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-paper border-t border-ink/10 px-6 py-6 flex flex-col gap-4">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="font-mono text-sm text-mist hover:text-ink py-2 border-b border-ink/5 transition-colors">
              {l.label}
            </a>
          ))}
          <Link href="/admin" className="font-mono text-sm text-rust mt-2">→ Admin Panel</Link>
        </div>
      )}
    </header>
  );
}
