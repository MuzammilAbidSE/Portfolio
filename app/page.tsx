'use client';

import { useState, useEffect } from 'react';
import ProjectModal from '@/components/projectModal';
import Navbar from '@/components/navbar';

interface Project { id:string; name:string; description:string; technologies:string[]; images:string[]; }

const skills: Record<string,string[]> = {
  Backend:  ['Express.JS','Nest.JS','REST APIs','Microservices','WebSockets','Web Scraping','JEST'],
  Frontend: ['React.JS','Next.JS','Redux','HTML','CSS','JavaScript','Ajax','jQuery'],
  Database: ['PostgreSQL','MySQL','MongoDB','Redis','SQL Server'],
  DevOps:   ['Git','Docker','Kubernetes','CI/CD Pipelines'],
  Others:   ['AI Automation','N8N Automation','LLM Integration'],
};

const experience = [
  { company:'Mux Tech PVT LTD', role:'Full Stack Engineer', period:'Sep 2022 – Present', current:true,
    bullets:['Led architecture, development, and optimization of vehicle tracking platform ensuring high availability and scalability.','Collaborated with cross-functional teams to translate business requirements into technical solutions.','Defined system architecture, project timelines, and key deliverables.'] },
  { company:'The Codex IT Solution', role:'Full Stack Engineer', period:'Apr 2022 – Aug 2022', current:false,
    bullets:['Managed end-to-end delivery and customization of CRM, POS, and accounting platforms for diverse clients.','Ensured seamless integration with existing business workflows.'] },
  { company:'SIDR Developers', role:'Web App Developer', period:'Dec 2021 – Apr 2022', current:false,
    bullets:['Developed and maintained full-stack web applications as part of a collaborative engineering team.','Diagnosed and resolved complex issues while supporting testing and deployment pipelines.'] },
];

const stats = [
  { num:'3+', label:'Years of Experience' },
  { num:'4+',  label:'Major Products Shipped' },
  { num:'15+',label:'Technologies Mastered' },
  { num:'∞',  label:'Lines of Code' },
];

function SectionLabel({ text, light=false }:{ text:string; light?:boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-px bg-rust flex-shrink-0" />
      <span className={`font-mono text-[0.65rem] text-rust uppercase tracking-[0.2em]`}>{text}</span>
    </div>
  );
}

function ProjectCard({ project, index, onClick }:{ project:Project; index:number; onClick:()=>void }) {
  const icons = ['⬡','◈','◉'];
  return (
    <button onClick={onClick}
      className="project-card-hover w-full text-left bg-cream border border-ink/10 hover:border-rust/60 overflow-hidden block">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-72 lg:w-96 flex-shrink-0 h-52 md:h-auto bg-ink/5 overflow-hidden">
          {project.images?.length > 0 ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.images[0]} alt={project.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
        <div className="flex-1 p-8 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[0.6rem] text-rust tracking-[0.2em] uppercase mb-3">
                  Project {String(index+1).padStart(2,'0')}
                </div>
                <h3 className="font-display text-2xl lg:text-3xl text-ink group-hover:text-rust transition-colors leading-tight">
                  {project.name}
                </h3>
              </div>
              <div className="flex-shrink-0 w-10 h-10 border border-ink/20 flex items-center justify-center text-lg text-ink transition-all duration-300">
                ↗
              </div>
            </div>
            <p className="mt-4 text-mist text-sm leading-relaxed line-clamp-3">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0,6).map(t => (
              <span key={t} className="font-mono text-[0.6rem] border border-ink/20 text-mist px-3 py-1 tracking-wider">
                {t}
              </span>
            ))}
            {project.technologies.length > 6 && (
              <span className="font-mono text-[0.6rem] text-mist px-2 py-1">+{project.technologies.length-6} more</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project|null>(null);

  useEffect(() => {
    fetch('/api/projects').then(r=>r.json()).then(setProjects).catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-paper">
      <Navbar />

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage:'linear-gradient(#0A0A0A 1px,transparent 1px),linear-gradient(90deg,#0A0A0A 1px,transparent 1px)',
          backgroundSize:'60px 60px'
        }} />
        <div className="absolute top-32 right-0 w-[500px] h-[500px] rounded-full bg-rust opacity-5 blur-3xl" />
        <div className="absolute bottom-0 left-20 w-[300px] h-[300px] rounded-full bg-amber opacity-5 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-20 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8 animate-on-load stagger-1">
                <div className="w-8 h-px bg-rust" />
                <span className="font-mono text-[0.65rem] text-rust tracking-[0.2em] uppercase">Full Stack Engineer</span>
              </div>

              <h1 className="animate-on-load stagger-2 font-display leading-[0.92] text-ink"
                style={{fontSize:'clamp(3rem,8vw,6.5rem)', opacity:0}}>
                Muhammad<br />
                <em className="text-rust not-italic" style={{fontStyle:'italic'}}>Muzammil</em><br />
                Abid
              </h1>

              <p className="animate-on-load stagger-3 mt-8 text-mist text-lg leading-relaxed max-w-xl"
                style={{opacity:0}}>
                Full Stack Software Engineer with 3+ years of experience building scalable web
                applications using Node.js, NestJS, React, and PostgreSQL. Specializing in
                microservices architectures and real-time systems.
              </p>

              <div className="animate-on-load stagger-4 mt-10 flex flex-wrap gap-4" style={{opacity:0}}>
                <a href="#projects"
                  className="px-8 py-4 bg-ink text-paper font-mono text-sm tracking-wider hover:bg-rust transition-colors duration-300">
                  View Work →
                </a>
                <a href="mailto:mm1225121@gmail.com"
                  className="px-8 py-4 border border-ink text-ink font-mono text-sm tracking-wider hover:border-rust hover:text-rust transition-colors duration-300">
                  Get in Touch
                </a>
              </div>

              <div className="animate-on-load stagger-5 mt-12 flex flex-wrap gap-6" style={{opacity:0}}>
                {[
                  {label:'Email',    value:'mm1225121@gmail.com', href:'mailto:mm1225121@gmail.com'},
                  {label:'Phone',    value:'+92304-8002661',      href:'tel:+923048002661'},
                  {label:'Location', value:'Multan, Pakistan',    href:'#'},
                ].map(c => (
                  <a key={c.label} href={c.href} className="group">
                    <div className="font-mono text-[0.6rem] text-mist tracking-widest mb-1 uppercase">{c.label}</div>
                    <div className="text-sm text-ink group-hover:text-rust transition-colors">{c.value}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* Stat cards */}
            <div className="hidden lg:flex flex-col gap-5 items-end">
              {stats.map((s,i) => (
                <div key={s.label}
                  className="animate-on-load bg-cream border border-ink/10 px-8 py-5 w-64"
                  style={{opacity:0, animationDelay:`${0.2+i*0.1}s`}}>
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
      <section id="experience" className="py-32 bg-ink text-paper relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage:'repeating-linear-gradient(45deg,#F5F0E8 0,#F5F0E8 1px,transparent 0,transparent 50%)',
          backgroundSize:'20px 20px'
        }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
          <SectionLabel text="Work History" />
          <h2 className="font-display text-paper mt-4 mb-20" style={{fontSize:'clamp(2.5rem,6vw,5rem)'}}>
            Experience
          </h2>
          <div className="relative">
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-paper/10" />
            {experience.map(job => (
              <div key={job.company} className="group lg:pl-16 relative border-b border-paper/10 hover:border-rust/40 py-10 transition-colors">
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
                  {job.bullets.map((b,j) => (
                    <li key={j} className="flex gap-3 text-paper/70 text-sm leading-relaxed">
                      <span className="text-rust mt-1 flex-shrink-0">›</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionLabel text="Technical Stack" />
          <h2 className="font-display text-ink mt-4 mb-20" style={{fontSize:'clamp(2.5rem,6vw,5rem)'}}>
            Core Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {Object.entries(skills).map(([cat,techs]) => (
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
              <h2 className="font-display text-ink mt-4" style={{fontSize:'clamp(2.5rem,6vw,5rem)'}}>Projects</h2>
            </div>
            {/* <a href="/admin"
              className="font-mono text-[0.65rem] text-mist hover:text-rust border border-mist/30 hover:border-rust px-4 py-2 transition-colors self-start">
              Manage Projects →
            </a> */}
          </div>

          {projects.length > 0 ? (
            <div className="flex flex-col gap-6">
              {projects.map((p,i) => (
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
      <section id="about" className="py-32 bg-ink text-paper">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20">
          <div>
            <SectionLabel text="About Me" />
            <h2 className="font-display text-paper mt-4 mb-8" style={{fontSize:'clamp(2.5rem,5vw,4rem)'}}>Who I Am</h2>
            <p className="text-paper/70 leading-relaxed text-lg mb-6">
              I&apos;m a Full Stack Engineer based in Multan, Pakistan, with over 3 years of experience
              building production-grade web systems. I specialize in backend-heavy architecture —
              from microservices to real-time WebSocket systems — while maintaining strong frontend skills.
            </p>
            <p className="text-paper/70 leading-relaxed text-lg">
              Currently at Mux Tech, I lead end-to-end development of a fleet management platform
              serving real operators. Passionate about AI automation and LLM integration.
            </p>
            <div className="mt-8 inline-block border border-paper/10 px-4 py-2">
              <span className="font-mono text-[0.65rem] text-mist">Open to Remote Opportunities</span>
            </div>
          </div>

          <div>
            <SectionLabel text="Education" />
            <h2 className="font-display text-paper mt-4 mb-10" style={{fontSize:'clamp(2.5rem,5vw,4rem)'}}>Academics</h2>
            <div className="border-l-2 border-rust pl-6 mb-8">
              <div className="font-mono text-[0.65rem] text-rust tracking-widest mb-2">Apr 2018 – Mar 2022</div>
              <h3 className="font-display text-xl text-paper">BSc Information Technology</h3>
              <p className="text-paper/60 text-sm mt-1">University of Southern Punjab, Multan</p>
              <div className="mt-2 inline-block bg-rust/20 border border-rust/30 px-3 py-1">
                <span className="font-mono text-[0.65rem] text-rust">GPA: 3.19 / 4.00</span>
              </div>
            </div>
            <div className="border-l-2 border-paper/20 pl-6">
              <div className="font-mono text-[0.65rem] text-mist tracking-widest mb-2">Sep 2015 – May 2017</div>
              <h3 className="font-display text-xl text-paper">Intermediate</h3>
              <p className="text-paper/60 text-sm mt-1">BISE Multan, Pakistan</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-32 bg-cream text-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionLabel text="Let's Work Together" />
          <h2 className="font-display text-ink mt-4 mb-6 leading-none" style={{fontSize:'clamp(3rem,8vw,7rem)'}}>
            Get in Touch
          </h2>
          <p className="text-mist max-w-xl mx-auto mb-12 text-lg">
            Open to remote opportunities, freelance projects, and interesting collaborations.
          </p>
          <a href="mailto:mm1225121@gmail.com"
            className="inline-block px-12 py-5 bg-rust text-paper font-mono text-sm tracking-widest hover:bg-ink transition-colors duration-300">
            mm1225121@gmail.com
          </a>
        </div>
      </section>

      <footer className="bg-ink border-t border-paper/5 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-mono text-[0.65rem] text-paper/40">© 2024 Muhammad Muzammil Abid</span>
          <span className="font-mono text-[0.65rem] text-paper/40">Full Stack Engineer · Multan, Pakistan</span>
        </div>
      </footer>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
