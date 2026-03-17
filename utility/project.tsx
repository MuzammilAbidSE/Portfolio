import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json');

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  images: string[]; // relative paths like /uploads/projects/xxx.jpg
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
      description: 'Real-time fleet tracking platform for monitoring vehicle locations and driver activity. Features include live GPS tracking, trip history, route playback, geofencing alerts, driver management, and fuel consumption reports.',
      technologies: ['Node.js', 'NestJS', 'PostgreSQL', 'Redis', 'WebSockets', 'REST APIs', 'Next.js'],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'CMS FOR Vehicle Tracking',
      description: 'CRM system to manage rental vehicles, customers, and contracts. Includes automated traffic fine detection via web scraping, fine history tracking, notifications for violations, and fleet performance dashboards.',
      technologies: ['Node.js', 'NestJS', 'PostgreSQL', 'Puppeteer', 'Redis', 'REST APIs', 'Next.js'],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Whatsapp portal for TeleSales',
      description: 'CRM system to manage rental vehicles, customers, and contracts. Includes automated traffic fine detection via web scraping, fine history tracking, notifications for violations, and fleet performance dashboards.',
      technologies: ['Node.js', 'NestJS', 'PostgreSQL', 'Puppeteer', 'Redis', 'REST APIs', 'Next.js'],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Building Contracting & Project Management System',
      description: 'System to manage construction projects, contractors, and resources. Covers project planning, progress tracking, contractor/subcontractor management, budget and expense tracking, material inventory, procurement, and document management.',
      technologies: ['NestJS', 'Next.js', 'PostgreSQL', 'TypeScript', 'REST APIs', 'Role-Based Access Control'],
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