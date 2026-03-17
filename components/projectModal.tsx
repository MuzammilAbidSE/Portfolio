'use client';

import { useState, useEffect, useCallback } from 'react';

interface Project {
  id: string; name: string; description: string;
  technologies: string[]; images: string[];
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-paper/90 hover:bg-paper flex items-center justify-center text-ink hover:text-rust text-xl shadow-lg border-0 cursor-pointer transition-colors">
                      ‹
                    </button>
                    <button onClick={next}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-paper/90 hover:bg-paper flex items-center justify-center text-ink hover:text-rust text-xl shadow-lg border-0 cursor-pointer transition-colors">
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-cream">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                      className={`flex-shrink-0 w-16 h-12 overflow-hidden border-2 cursor-pointer transition-all ${
                        i === current ? 'border-rust' : 'border-transparent hover:border-ink/30'
                      }`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-ink/5 to-rust/5 gap-3">
              <div className="text-7xl text-rust/15">◈</div>
              <div className="font-mono text-[0.65rem] text-mist tracking-[0.2em]">NO IMAGES ADDED</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          <h2 className="font-display text-3xl md:text-4xl text-ink leading-tight mb-4">{project.name}</h2>
          <p className="text-mist leading-relaxed mb-8 text-sm md:text-base">{project.description}</p>
          <div className="flex items-center gap-2 font-mono text-[0.6rem] text-rust uppercase tracking-[0.2em] mb-3">
            <div className="w-4 h-px bg-rust" /> Technologies
          </div>
          <div className="flex flex-wrap gap-2">
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
  );
}
