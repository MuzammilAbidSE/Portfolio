"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const links = [
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-paper/95 backdrop-blur border-b border-ink/10 shadow-sm"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 lg:h-[72px] flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl text-ink hover:text-rust transition-colors"
        >
          MMA<span className="text-rust">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[0.65rem] text-mist hover:text-ink uppercase tracking-[0.12em] transition-colors"
            >
              {l.label}
            </a>
          ))}

          {/* GitHub */}
          <a
            href="https://github.com/MuzammilAbidSE"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.65rem] text-mist hover:text-ink transition-colors flex items-center gap-1.5"
            title="GitHub"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/muhammad-muzammil-abid-566b54169/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.65rem] text-mist hover:text-ink transition-colors flex items-center gap-1.5"
            title="LinkedIn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>

          {/* <Link href="/admin"
            className="font-mono text-[0.65rem] border border-rust text-rust hover:bg-rust hover:text-paper px-4 py-2 tracking-[0.1em] transition-all">
            Admin
          </Link> */}
        </nav>

        {/* Hamburger */}
        <button
          className="lg:hidden flex flex-col gap-[5px] p-2 bg-transparent border-0 cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-px bg-ink transition-all duration-300 ${open ? "rotate-45 translate-y-[6px]" : ""}`}
          />
          <span
            className={`block w-6 h-px bg-ink transition-all duration-300 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-px bg-ink transition-all duration-300 ${open ? "-rotate-45 -translate-y-[6px]" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-paper border-t border-ink/10 px-6 py-6 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-mono text-sm text-mist hover:text-ink py-2 border-b border-ink/5 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://github.com/muzammilabid"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-mist hover:text-ink py-2 border-b border-ink/5 transition-colors"
          >
            GitHub ↗
          </a>
          <a
            href="https://linkedin.com/in/muzammilabid"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-mist hover:text-ink py-2 border-b border-ink/5 transition-colors"
          >
            LinkedIn ↗
          </a>
          <Link href="/admin" className="font-mono text-sm text-rust mt-2">
            → Admin Panel
          </Link>
        </div>
      )}
    </header>
  );
}
