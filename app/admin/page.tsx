'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface Project {
  id: string; name: string; description: string;
  impact: string; architecture: string;
  technologies: string[]; githubUrl: string; liveUrl: string; images: string[];
}

const empty = {
  name: '', description: '', impact: '', architecture: '',
  technologies: '', githubUrl: '', liveUrl: '', images: [] as string[],
};

export default function AdminPage() {
  const [projects, setProjects]           = useState<Project[]>([]);
  const [form, setForm]                   = useState(empty);
  const [editId, setEditId]               = useState<string | null>(null);
  const [dragOver, setDragOver]           = useState(false);
  const [uploading, setUploading]         = useState(false);
  const [saving, setSaving]               = useState(false);
  const [toast, setToast]                 = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileRef                           = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const r = await fetch('/api/projects');
    setProjects(await r.json());
  }, []);
  useEffect(() => { load(); }, [load]);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function upload(files: File[]) {
    const valid = files.filter(f => f.type.startsWith('image/'));
    if (!valid.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      valid.forEach(f => fd.append('files', f));
      const r = await fetch('/api/upload', { method: 'POST', body: fd });
      const d = await r.json();
      if (d.paths) { setForm(p => ({ ...p, images: [...p.images, ...d.paths] })); showToast(`${d.paths.length} image(s) uploaded`); }
    } catch { showToast('Upload failed', 'error'); }
    finally   { setUploading(false); }
  }

  function onDrop(e: React.DragEvent) { e.preventDefault(); setDragOver(false); upload(Array.from(e.dataTransfer.files)); }
  function onFile(e: React.ChangeEvent<HTMLInputElement>) { if (e.target.files) upload(Array.from(e.target.files)); }
  function removeImg(i: number) { setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) })); }

  function startEdit(p: Project) {
    setEditId(p.id);
    setForm({
      name: p.name, description: p.description,
      impact: p.impact || '', architecture: p.architecture || '',
      technologies: p.technologies.join(', '),
      githubUrl: p.githubUrl || '', liveUrl: p.liveUrl || '',
      images: p.images,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function cancel() { setEditId(null); setForm(empty); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) { showToast('Name and description required', 'error'); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name, description: form.description,
        impact: form.impact, architecture: form.architecture,
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
        githubUrl: form.githubUrl, liveUrl: form.liveUrl,
        images: form.images,
        ...(editId ? { id: editId } : {}),
      };
      const r = await fetch('/api/projects', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (r.ok) { showToast(editId ? 'Updated!' : 'Created!'); cancel(); load(); }
      else showToast('Save failed', 'error');
    } finally { setSaving(false); }
  }

  async function del(id: string) {
    const r = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
    if (r.ok) { showToast('Deleted'); setDeleteConfirm(null); load(); }
    else showToast('Delete failed', 'error');
  }

  const f = (field: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-ink text-paper">

      {/* Toast */}
      {toast && (
        <div className={`animate-slide-in fixed top-6 right-6 z-50 px-6 py-3 font-mono text-sm shadow-xl ${
          toast.type === 'success' ? 'bg-rust text-paper' : 'bg-red-800 text-paper'
        }`}>{toast.msg}</div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-paper/10 px-6 lg:px-12 py-5 flex items-center justify-between bg-ink/95 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-display text-xl text-paper hover:text-rust transition-colors">
            MMA<span className="text-rust">.</span>
          </Link>
          <div className="w-px h-5 bg-paper/20" />
          <span className="font-mono text-[0.6rem] text-mist tracking-[0.2em] uppercase">Admin Panel</span>
        </div>
        <Link href="/" className="font-mono text-[0.65rem] text-mist hover:text-rust border border-paper/10 hover:border-rust px-4 py-2 transition-colors">
          ← Portfolio
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid lg:grid-cols-5 gap-12">

        {/* ── FORM ── */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-28">
            <h2 className="font-display text-3xl text-paper mb-2">{editId ? 'Edit Project' : 'Add Project'}</h2>
            <p className="font-mono text-[0.65rem] text-mist mb-8">{editId ? 'Update project details' : 'Fill in all fields for a complete portfolio entry'}</p>

            <form onSubmit={submit} className="flex flex-col gap-5">

              <Field label="Project Name *">
                <input type="text" required value={form.name} onChange={f('name')}
                  placeholder="e.g. Fleet Management System"
                  className="w-full bg-paper/5 border border-paper/10 focus:border-rust text-paper text-sm px-4 py-3 outline-none transition-colors placeholder:text-mist/40" />
              </Field>

              <Field label="Description *" hint="What does it do?">
                <textarea required rows={3} value={form.description} onChange={f('description')}
                  placeholder="Describe what the project does and its key features..."
                  className="w-full bg-paper/5 border border-paper/10 focus:border-rust text-paper text-sm px-4 py-3 outline-none resize-none transition-colors placeholder:text-mist/40" />
              </Field>

              <Field label="⚡ Impact" hint="Why does it matter? Use numbers if possible.">
                <textarea rows={3} value={form.impact} onChange={f('impact')}
                  placeholder="e.g. Reduced manual tracking time by 80% for fleet operators managing 50+ vehicles..."
                  className="w-full bg-rust/5 border border-rust/20 focus:border-rust text-paper text-sm px-4 py-3 outline-none resize-none transition-colors placeholder:text-mist/40" />
              </Field>

              <Field label="⬡ Architecture" hint="How is it built? Tech decisions?">
                <textarea rows={4} value={form.architecture} onChange={f('architecture')}
                  placeholder="e.g. NestJS microservices with Redis pub/sub for real-time events. PostgreSQL with PostGIS for geospatial queries..."
                  className="w-full bg-paper/5 border border-paper/10 focus:border-rust text-paper text-sm px-4 py-3 outline-none resize-none transition-colors placeholder:text-mist/40 font-mono" />
              </Field>

              <Field label="Technologies" hint="comma-separated">
                <input type="text" value={form.technologies} onChange={f('technologies')}
                  placeholder="Node.js, NestJS, PostgreSQL, Redis..."
                  className="w-full bg-paper/5 border border-paper/10 focus:border-rust text-paper text-sm px-4 py-3 outline-none transition-colors placeholder:text-mist/40" />
                {form.technologies && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.technologies.split(',').filter(t => t.trim()).map((t, i) => (
                      <span key={i} className="font-mono text-[0.6rem] bg-rust/20 border border-rust/30 text-rust px-2 py-0.5">{t.trim()}</span>
                    ))}
                  </div>
                )}
              </Field>

              <div className="grid grid-cols-1 gap-4">
                <Field label="GitHub URL" hint="optional">
                  <div className="flex items-center border border-paper/10 focus-within:border-rust transition-colors">
                    <span className="px-3 py-3 text-mist/50 border-r border-paper/10">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-mist/60">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </span>
                    <input type="url" value={form.githubUrl} onChange={f('githubUrl')}
                      placeholder="https://github.com/..."
                      className="flex-1 bg-paper/5 text-paper text-sm px-4 py-3 outline-none placeholder:text-mist/40" />
                  </div>
                </Field>

                <Field label="Live Demo URL" hint="optional">
                  <div className="flex items-center border border-paper/10 focus-within:border-rust transition-colors">
                    <span className="px-3 py-3 border-r border-paper/10 text-rust/50">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </span>
                    <input type="url" value={form.liveUrl} onChange={f('liveUrl')}
                      placeholder="https://yourapp.com"
                      className="flex-1 bg-paper/5 text-paper text-sm px-4 py-3 outline-none placeholder:text-mist/40" />
                  </div>
                </Field>
              </div>

              {/* Drop zone */}
              <Field label="Project Images" hint="drag & drop or click to browse multiple">
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                    dragOver ? 'border-rust bg-rust/10' : 'border-paper/20 hover:border-paper/40 bg-paper/5'
                  }`}>
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin-slow w-6 h-6 border-2 border-rust border-t-transparent rounded-full" />
                      <span className="font-mono text-[0.65rem] text-mist">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl mb-3 text-rust/40">{dragOver ? '⬇' : '⬆'}</div>
                      <div className="font-mono text-[0.7rem] text-paper/60 mb-1">{dragOver ? 'Drop files here' : 'Drag & drop images'}</div>
                      <div className="font-mono text-[0.6rem] text-mist">or click to browse · PNG, JPG, WEBP · multiple at once</div>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFile} className="hidden" />

                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative group aspect-video bg-paper/10 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImg(i)}
                          className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-paper text-lg hover:text-rust border-0 cursor-pointer transition-all">
                          ✕
                        </button>
                        {i === 0 && <div className="absolute top-1 left-1 bg-rust font-mono text-[0.5rem] text-paper px-1.5 py-0.5">COVER</div>}
                      </div>
                    ))}
                  </div>
                )}
              </Field>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-rust hover:bg-amber text-paper font-mono text-[0.7rem] tracking-widest py-4 transition-colors uppercase disabled:opacity-50 cursor-pointer border-0">
                  {saving ? 'Saving...' : editId ? 'Update Project' : 'Add Project'}
                </button>
                {editId && (
                  <button type="button" onClick={cancel}
                    className="border border-paper/20 hover:border-paper/40 text-mist font-mono text-[0.7rem] px-6 bg-transparent cursor-pointer transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ── PROJECT LIST ── */}
        <div className="lg:col-span-3">
          <h2 className="font-display text-3xl text-paper mb-8 flex items-baseline gap-3">
            All Projects <span className="font-mono text-sm text-rust">{projects.length}</span>
          </h2>

          {projects.length === 0 ? (
            <div className="border border-paper/10 p-16 text-center">
              <div className="text-5xl mb-4 text-rust/20">◈</div>
              <div className="font-mono text-[0.7rem] text-mist">No projects yet. Add one!</div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {projects.map(p => (
                <div key={p.id} className={`border transition-colors ${editId === p.id ? 'border-rust bg-rust/5' : 'border-paper/10 hover:border-paper/20'}`}>
                  <div className="flex gap-4 p-4">
                    <div className="w-24 h-20 flex-shrink-0 bg-paper/5 overflow-hidden flex items-center justify-center">
                      {p.images[0]
                        ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                        : <span className="text-2xl text-rust/20">◈</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-lg text-paper truncate">{p.name}</div>
                      <div className="text-mist text-[0.75rem] leading-relaxed mt-1 line-clamp-2">{p.description}</div>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {p.githubUrl && (
                          <span className="font-mono text-[0.55rem] text-rust flex items-center gap-1">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                            GitHub
                          </span>
                        )}
                        {p.liveUrl && <span className="font-mono text-[0.55rem] text-rust">↗ Live</span>}
                        {p.impact && <span className="font-mono text-[0.55rem] text-amber/70">⚡ Impact</span>}
                        {p.architecture && <span className="font-mono text-[0.55rem] text-mist">⬡ Arch</span>}
                        {p.images.length > 0 && <span className="font-mono text-[0.55rem] text-mist">{p.images.length} img{p.images.length > 1 ? 's' : ''}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button onClick={() => startEdit(p)}
                        className="font-mono text-[0.6rem] border border-paper/20 hover:border-rust text-mist hover:text-rust px-3 py-1.5 bg-transparent cursor-pointer transition-colors">
                        Edit
                      </button>
                      <button onClick={() => setDeleteConfirm(p.id)}
                        className="font-mono text-[0.6rem] border border-paper/10 hover:border-red-500 text-mist hover:text-red-400 px-3 py-1.5 bg-transparent cursor-pointer transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-4">
          <div className="bg-paper text-ink p-8 max-w-sm w-full">
            <h3 className="font-display text-2xl mb-3">Delete Project?</h3>
            <p className="text-mist text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => del(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-paper font-mono text-[0.7rem] py-3 border-0 cursor-pointer transition-colors">
                Yes, Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-ink/20 hover:border-ink/40 text-mist font-mono text-[0.7rem] py-3 bg-transparent cursor-pointer transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-[0.6rem] text-rust uppercase tracking-[0.2em] mb-2">
        {label}
        {hint && <span className="font-sans normal-case tracking-normal text-mist text-[0.68rem] ml-2">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
