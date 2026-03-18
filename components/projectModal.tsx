'use client';

import { useState, useEffect, useCallback } from 'react';

interface Project {
  id: string; name: string; description: string;
  impact: string; architecture: string;
  technologies: string[]; githubUrl: string; liveUrl: string; images: string[];
}

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [current, setCurrent] = useState(0);
  const images = project.images || [];

  const prev = useCallback(() => setCurrent(c => (c === 0 ? images.length - 1 : c - 1)), [images.length]);
  const next = useCallback(() => setCurrent(c => (c === images.length - 1 ? 0 : c + 1)), [images.length]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose, prev, next]);

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[100] bg-ink/80 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-modal-in bg-paper w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl">

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-ink text-paper hover:bg-rust transition-colors text-base cursor-pointer border-0">
          ✕
        </button>

        {/* Carousel */}
        <div className="relative bg-ink/5">
          {images.length > 0 ? (
            <>
              <div className="relative w-full h-72 md:h-96 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={current} src={images[current]} alt={`${project.name} ${current + 1}`}
                  className="animate-fade-in w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/30 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 right-4 bg-ink/70 text-paper font-mono text-[0.65rem] px-3 py-1">
                  {current + 1} / {images.length}
                </div>
                {images.length > 1 && (
                  <>
                    <button onClick={prev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-paper/90 hover:bg-paper flex items-center justify-center text-ink hover:text-rust text-xl shadow-lg border-0 cursor-pointer transition-colors">‹</button>
                    <button onClick={next}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-paper/90 hover:bg-paper flex items-center justify-center text-ink hover:text-rust text-xl shadow-lg border-0 cursor-pointer transition-colors">›</button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-cream">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                      className={`flex-shrink-0 w-16 h-12 overflow-hidden border-2 cursor-pointer transition-all ${i === current ? 'border-rust' : 'border-transparent hover:border-ink/30'}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-52 bg-gradient-to-br from-ink/5 to-rust/5 gap-3">
              <div className="text-6xl text-rust/15">◈</div>
              <div className="font-mono text-[0.65rem] text-mist tracking-[0.2em]">NO IMAGES ADDED</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 flex flex-col gap-8">

          {/* Title + action buttons */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-ink leading-tight mb-5">{project.name}</h2>
            <div className="flex flex-wrap gap-3">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-[0.7rem] bg-ink text-paper hover:bg-rust px-4 py-2.5 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  View on GitHub
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-[0.7rem] border border-rust text-rust hover:bg-rust hover:text-paper px-4 py-2.5 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Live Demo
                </a>
              )}
              {!project.githubUrl && !project.liveUrl && (
                <div className="font-mono text-[0.65rem] text-mist border border-mist/20 px-4 py-2.5">
                  Private / Internal Project
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <ModalLabel text="Overview" />
            <p className="text-ink/80 leading-relaxed text-sm md:text-base mt-3">{project.description}</p>
          </div>

          {/* Impact — WHY IT MATTERS */}
          {project.impact && (
            <div className="bg-rust/8 border-l-4 border-rust p-5">
              <ModalLabel text="Why It Matters" icon="⚡" />
              <p className="text-ink/80 leading-relaxed text-sm mt-3 font-medium">{project.impact}</p>
            </div>
          )}

          {/* Architecture */}
          {project.architecture && (
            <div>
              <ModalLabel text="Architecture & Technical Decisions" icon="⬡" />
              <p className="text-ink/70 leading-relaxed text-sm mt-3 font-mono bg-ink/[0.03] border border-ink/8 p-4"
                style={{lineHeight: '1.8'}}>
                {project.architecture}
              </p>
            </div>
          )}

          {/* Tech stack */}
          <div>
            <ModalLabel text="Tech Stack" icon="◈" />
            <div className="flex flex-wrap gap-2 mt-3">
              {project.technologies.map(t => (
                <span key={t}
                  className="font-mono text-[0.7rem] border border-ink/20 text-ink px-3 py-1.5 bg-cream hover:border-rust hover:text-rust transition-colors cursor-default">
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ModalLabel({ text, icon }: { text: string; icon?: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[0.6rem] text-rust uppercase tracking-[0.2em]">
      <div className="w-4 h-px bg-rust flex-shrink-0" />
      {icon && <span className="text-rust">{icon}</span>}
      {text}
    </div>
  );
}
