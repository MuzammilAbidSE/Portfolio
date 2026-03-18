import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json');

export interface Project {
  id: string;
  name: string;
  description: string;
  impact: string;           // "Why it matters" — 1-2 sentences with numbers
  architecture: string;     // How it's built — system design explanation
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(defaultProjects(), null, 2));
}

function defaultProjects(): Project[] {
  return [
    {
      id: '1',
      name: 'Vehicle Tracking & Fleet Management System',
      description: 'Real-time fleet tracking platform for monitoring vehicle locations and driver activity across an entire fleet. Features live GPS tracking with sub-second updates, full trip history, route playback, geofencing alerts, driver behavior scoring, and automated fuel consumption reports.',
      impact: 'Reduced operational costs by eliminating manual tracking for fleet operators managing 50+ vehicles. Route optimization cut fuel expenses significantly and geofencing alerts reduced unauthorized vehicle usage.',
      architecture: 'WebSocket gateway (NestJS) pushes GPS events from vehicle devices to connected clients in real time. PostgreSQL stores trip history with PostGIS for geospatial queries. Redis caches live vehicle positions and pub/sub fan-out to multiple dashboard clients. Next.js frontend renders a live map using Leaflet. Role-based access separates admin, dispatcher, and driver views.',
      technologies: ['Node.js', 'NestJS', 'PostgreSQL', 'Redis', 'WebSockets', 'Next.js', 'REST APIs', 'Leaflet', 'PostGIS'],
      githubUrl: '',
      liveUrl: '',
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Rental Car Management CRM',
      description: 'Full CRM for rental car companies to manage vehicles, customers, contracts, and compliance. Includes automated traffic fine detection via web scraping, fine history tracking with customer notifications, and a reporting dashboard for fleet performance and violations.',
      impact: 'Automated traffic fine detection eliminated hours of daily manual government portal checks. Rental companies recovered fine costs from customers on time instead of absorbing them, directly improving revenue.',
      architecture: 'Puppeteer-based scraper runs on a scheduled NestJS cron job, logging into government traffic portals and extracting fine data per license plate. Violations are matched to active rental contracts in PostgreSQL. A notification service emails customers and generates invoice PDFs. Redis queues handle scraping jobs to avoid rate limiting.',
      technologies: ['Node.js', 'NestJS', 'PostgreSQL', 'Puppeteer', 'Redis', 'Next.js', 'REST APIs', 'Cron Jobs'],
      githubUrl: '',
      liveUrl: '',
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Building Contracting & Project Management System',
      description: 'End-to-end system for managing construction projects, contractors, subcontractors, and resources. Covers project planning with milestone tracking, budget and expense management, material inventory and procurement, and full document management for contracts and project files.',
      impact: 'Replaced fragmented spreadsheets and WhatsApp chains for a construction company managing multiple simultaneous projects. Budget overrun visibility improved dramatically and contractor accountability increased through real-time progress tracking.',
      architecture: 'NestJS REST API with TypeScript and a modular domain structure — separate modules for projects, contractors, budgets, materials, and documents. PostgreSQL with TypeORM handles relational data. File uploads stored locally with metadata in DB. Role-based access control distinguishes admin, project manager, contractor, and viewer roles. Next.js dashboard renders Gantt-style timelines and budget burn charts.',
      technologies: ['NestJS', 'Next.js', 'PostgreSQL', 'TypeScript', 'TypeORM', 'REST APIs', 'RBAC'],
      githubUrl: '',
      liveUrl: '',
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export function getProjects(): Project[] {
  ensureDataDir();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function saveProjects(projects: Project[]) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find(p => p.id === id);
}

export function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
  const projects = getProjects();
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.push(newProject);
  saveProjects(projects);
  return newProject;
}

export function updateProject(id: string, updates: Partial<Project>): Project | null {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...updates, updatedAt: new Date().toISOString() };
  saveProjects(projects);
  return projects[idx];
}

export function deleteProject(id: string): boolean {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);
  if (filtered.length === projects.length) return false;
  saveProjects(filtered);
  return true;
}
