'use client';

import { useState, useEffect } from 'react';
import ProjectModal from '@/components/projectModal';
import Navbar from '@/components/navbar';

interface Project {
  id: string; name: string; description: string;
  impact: string; architecture: string;
  technologies: string[]; githubUrl: string; liveUrl: string; images: string[];
}

const skills: Record<string, string[]> = {
  Backend:  ['Express.JS', 'Nest.JS', 'REST APIs', 'Microservices', 'WebSockets', 'Web Scraping', 'JEST'],
  Frontend: ['React.JS', 'Next.JS', 'Redux', 'HTML', 'CSS', 'JavaScript', 'Ajax', 'jQuery'],
  Database: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQL Server'],
  DevOps:   ['Git', 'Docker', 'Kubernetes', 'CI/CD Pipelines'],
  Others:   ['AI Automation', 'N8N Automation', 'LLM Integration'],
};

const experience = [
  {
    company: 'Mux Tech PVT LTD', role: 'Full Stack Engineer', period: 'Sep 2022 – Present', current: true,
    bullets: [
      'Led architecture and development of a real-time vehicle tracking platform — handling live GPS, geofencing, and role-based access for fleet operators managing 50+ vehicles.',
      'Designed microservices architecture using NestJS + Redis pub/sub, enabling sub-second WebSocket updates across dashboard clients.',
      'Collaborated cross-functionally to define system architecture, project timelines, and technical deliverables.',
    ],
  },
  {
    company: 'The Codex IT Solution', role: 'Full Stack Engineer', period: 'Apr 2022 – Aug 2022', current: false,
    bullets: [
      'Delivered and customized CRM, POS, and accounting platforms for multiple clients.',
      'Ensured seamless integration of new features with existing client business workflows.',
    ],
  },
  {
    company: 'SIDR Developers', role: 'Web App Developer', period: 'Dec 2021 – Apr 2022', current: false,
    bullets: [
      'Built and maintained full-stack web applications as part of a collaborative engineering team.',
      'Supported testing and deployment pipelines to maintain high performance and system reliability.',
    ],
  },
];

const stats = [
  { num: '3+',  label: 'Years of Experience' },
  { num: '4',   label: 'Major Products Shipped' },
  { num: '15+', label: 'Technologies Mastered' },
  { num: '50+', label: 'Vehicles Tracked Live' },
];

const socialLinks = [
  {
    label: 'GitHub', href: 'https://github.com/MuzammilAbidSE',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>,
  },
  {
    label: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammad-muzammil-abid-566b54169',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
];

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-px bg-rust flex-shrink-0" />
      <span className="font-mono text-[0.65rem] text-rust uppercase tracking-[0.2em]">{text}</span>
    </div>
  );
}

function ProjectCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  const icons = ['⬡', '◈', '◉'];
  return (
    <button onClick={onClick}
      className="project-card-hover w-full text-left bg-cream border border-ink/10 hover:border-rust/60 overflow-hidden block group">
      <div className="flex flex-col md:flex-row">

        {/* Image */}
        <div className="relative md:w-72 lg:w-96 flex-shrink-0 h-52 md:h-auto bg-ink/5 overflow-hidden">
          {project.images?.length > 0 ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.images[0]} alt={project.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {project.images.length > 1 && (
                <div className="absolute top-3 right-3 bg-ink/75 text-paper font-mono text-[0.6rem] px-2 py-0.5">
                  +{project.images.length} photos
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-ink/5 to-rust/5">
              <div className="text-6xl text-rust/20">{icons[index % icons.length]}</div>
              <div className="font-mono text-[0.6rem] text-mist tracking-[0.2em]">NO PREVIEW</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-8 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="font-mono text-[0.6rem] text-rust tracking-[0.2em] uppercase mb-2">
                  Project {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display text-2xl lg:text-3xl text-ink group-hover:text-rust transition-colors leading-tight">
                  {project.name}
                </h3>
              </div>
              <div className="flex-shrink-0 w-10 h-10 border border-ink/20 group-hover:border-rust group-hover:bg-rust flex items-center justify-center text-lg text-ink group-hover:text-paper transition-all duration-300">
                ↗
              </div>
            </div>

            <p className="text-mist text-sm leading-relaxed line-clamp-2">{project.description}</p>

            {/* Impact callout */}
            {project.impact && (
              <div className="mt-4 flex gap-2 items-start bg-rust/8 border-l-2 border-rust px-3 py-2">
                <span className="text-rust text-xs mt-0.5 flex-shrink-0">⚡</span>
                <p className="text-ink/70 text-xs leading-relaxed line-clamp-2">{project.impact}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {/* Tech tags */}
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 5).map(t => (
                <span key={t} className="font-mono text-[0.6rem] border border-ink/20 text-mist px-2.5 py-1 tracking-wider">
                  {t}
                </span>
              ))}
              {project.technologies.length > 5 && (
                <span className="font-mono text-[0.6rem] text-mist px-1 py-1">+{project.technologies.length - 5}</span>
              )}
            </div>

            {/* Links row */}
            <div className="flex items-center gap-4">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1.5 font-mono text-[0.65rem] text-mist hover:text-ink transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1.5 font-mono text-[0.65rem] text-rust hover:text-ink transition-colors">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Live Demo
                </a>
              )}
              {!project.githubUrl && !project.liveUrl && (
                <span className="font-mono text-[0.6rem] text-mist/50">Private project</span>
              )}
              <span className="ml-auto font-mono text-[0.6rem] text-rust/60 group-hover:text-rust transition-colors">
                Click for details →
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(setProjects).catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-paper">
      <Navbar />

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(#0A0A0A 1px,transparent 1px),linear-gradient(90deg,#0A0A0A 1px,transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute top-32 right-0 w-[500px] h-[500px] rounded-full bg-rust opacity-5 blur-3xl" />
        <div className="absolute bottom-0 left-20 w-[300px] h-[300px] rounded-full bg-amber opacity-5 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-20 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8 animate-on-load stagger-1">
                <div className="w-8 h-px bg-rust" />
                <span className="font-mono text-[0.65rem] text-rust tracking-[0.2em] uppercase">Full Stack Engineer · Open to Remote</span>
              </div>

              <h1 className="animate-on-load stagger-2 font-display leading-[0.92] text-ink"
                style={{ fontSize: 'clamp(3rem,8vw,6.5rem)', opacity: 0 }}>
                Haroon<br />
                <em className="text-rust" style={{ fontStyle: 'italic' }}>Mubeen</em>
              </h1>

              <p className="animate-on-load stagger-3 mt-8 text-mist text-lg leading-relaxed max-w-xl"
                style={{ opacity: 0 }}>
                Full Stack Engineer with 3+ years building real-time systems, microservices, and
                automation pipelines. Node.js · NestJS · Next.js · PostgreSQL · Redis.
              </p>

              {/* CTA row */}
              <div className="animate-on-load stagger-4 mt-10 flex flex-wrap gap-4" style={{ opacity: 0 }}>
                <a href="#projects"
                  className="px-8 py-4 bg-ink text-paper font-mono text-sm tracking-wider hover:bg-rust transition-colors duration-300">
                  View Work →
                </a>
                {/* <a href="mailto:mm1225121@gmail.com"
                  className="px-8 py-4 border border-ink text-ink font-mono text-sm tracking-wider hover:border-rust hover:text-rust transition-colors duration-300">
                  Get in Touch
                </a> */}
                {/* Download CV */}
                {/* <a href="/cv.pdf" download
                  className="px-8 py-4 border border-mist/40 text-mist font-mono text-sm tracking-wider hover:border-rust hover:text-rust transition-colors duration-300 flex items-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download CV
                </a> */}
              </div>

              {/* Social + contact */}
            </div>

            {/* Stat cards */}
            <div className="hidden lg:flex flex-col gap-5 items-end">
              {stats.map((s, i) => (
                <div key={s.label}
                  className="animate-on-load bg-cream border border-ink/10 px-8 py-5 w-64"
                  style={{ opacity: 0, animationDelay: `${0.2 + i * 0.1}s` }}>
                  <div className="font-display text-5xl text-rust mb-1">{s.num}</div>
                  <div className="font-mono text-[0.6rem] text-mist tracking-wider uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="animate-bounce-scroll absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="font-mono text-[0.6rem] text-mist tracking-widest">SCROLL</div>
          <div className="w-px h-12 bg-gradient-to-b from-mist to-transparent" />
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      {/* <section id="experience" className="py-32 bg-ink text-paper relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg,#F5F0E8 0,#F5F0E8 1px,transparent 0,transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
          <SectionLabel text="Work History" />
          <h2 className="font-display text-paper mt-4 mb-20" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>Experience</h2>
          <div className="relative">
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-paper/10" />
            {experience.map(job => (
              <div key={job.company}
                className="group lg:pl-16 relative border-b border-paper/10 hover:border-rust/40 py-10 transition-colors">
                <div className="hidden lg:block absolute left-0 top-10 w-3 h-3 rounded-full border-2 border-rust bg-ink -translate-x-[5px] group-hover:bg-rust transition-colors" />
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display text-2xl text-paper">{job.company}</h3>
                    <div className="font-mono text-sm text-rust mt-1">{job.role}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {job.current && <span className="font-mono text-[0.6rem] bg-rust text-paper px-3 py-1 tracking-widest uppercase">Current</span>}
                    <span className="font-mono text-sm text-mist">{job.period}</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {job.bullets.map((b, j) => (
                    <li key={j} className="flex gap-3 text-paper/70 text-sm leading-relaxed">
                      <span className="text-rust mt-1 flex-shrink-0">›</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── SKILLS ── */}
      <section id="skills" className="py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionLabel text="Technical Stack" />
          <h2 className="font-display text-ink mt-4 mb-20" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>Core Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {Object.entries(skills).map(([cat, techs]) => (
              <div key={cat} className="group bg-paper border border-ink/10 hover:border-rust/40 p-6 transition-colors">
                <div className="font-mono text-[0.6rem] text-rust tracking-[0.2em] uppercase mb-4">{cat}</div>
                <ul className="space-y-2">
                  {techs.map(t => (
                    <li key={t} className="flex items-center gap-2 text-sm text-ink/80 group-hover:text-ink transition-colors">
                      <span className="w-1 h-1 rounded-full bg-rust flex-shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="py-32 bg-paper">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
            <div>
              <SectionLabel text="Selected Work" />
              <h2 className="font-display text-ink mt-4" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>Projects</h2>
              <p className="text-mist text-sm mt-3 max-w-lg">
                Click any project to see architecture details, tech decisions, and the problem it solved.
              </p>
            </div>
            {/* <a href="/admin"
              className="font-mono text-[0.65rem] text-mist hover:text-rust border border-mist/30 hover:border-rust px-4 py-2 transition-colors self-start">
              Manage Projects →
            </a> */}
          </div>

          {projects.length > 0 ? (
            <div className="flex flex-col gap-6">
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} onClick={() => setSelected(p)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 font-mono text-sm text-mist">
              No projects yet. <a href="/admin" className="text-rust underline">Add some →</a>
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT / EDUCATION ── */}

      {/* ── CONTACT ── */}
      {/* <section id="contact" className="py-32 bg-cream text-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionLabel text="Let's Work Together" />
          <h2 className="font-display text-ink mt-4 mb-6 leading-none" style={{ fontSize: 'clamp(3rem,8vw,7rem)' }}>
            Get in Touch
          </h2>
          <p className="text-mist max-w-xl mx-auto mb-12 text-lg">
            Open to remote roles, freelance projects, and interesting collaborations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:mm1225121@gmail.com"
              className="inline-block px-12 py-5 bg-rust text-paper font-mono text-sm tracking-widest hover:bg-ink transition-colors duration-300">
              mm1225121@gmail.com
            </a>
            {socialLinks.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-5 border border-ink text-ink font-mono text-sm tracking-widest hover:border-rust hover:text-rust transition-colors duration-300">
                {s.icon} {s.label}
              </a>
            ))}
          </div>
        </div>
      </section> */}

      <footer className="bg-ink border-t border-paper/5 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-mono text-[0.65rem] text-paper/40">© 2024 Haroon Mubeen</span>
          {/* <div className="flex items-center gap-6">
            {socialLinks.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="text-paper/30 hover:text-paper/70 transition-colors">{s.icon}</a>
            ))}
          </div> */}
          <span className="font-mono text-[0.65rem] text-paper/40">Full Stack Engineer · Multan, Pakistan</span>
        </div>
      </footer>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
