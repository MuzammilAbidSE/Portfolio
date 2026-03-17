'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface Project { id:string; name:string; description:string; technologies:string[]; images:string[]; }

const empty = { name:'', description:'', technologies:'', images:[] as string[] };

export default function AdminPage() {
  const [projects, setProjects]           = useState<Project[]>([]);
  const [form, setForm]                   = useState(empty);
  const [editId, setEditId]               = useState<string|null>(null);
  const [dragOver, setDragOver]           = useState(false);
  const [uploading, setUploading]         = useState(false);
  const [saving, setSaving]               = useState(false);
  const [toast, setToast]                 = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string|null>(null);
  const fileRef                           = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const r = await fetch('/api/projects');
    setProjects(await r.json());
  }, []);
  useEffect(() => { load(); }, [load]);

  function toast$(msg:string, type:'success'|'error'='success') {
    setToast({msg,type});
    setTimeout(() => setToast(null), 3000);
  }

  async function upload(files: File[]) {
    const valid = files.filter(f => f.type.startsWith('image/'));
    if (!valid.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      valid.forEach(f => fd.append('files', f));
      const r = await fetch('/api/upload', {method:'POST', body:fd});
      const d = await r.json();
      if (d.paths) { setForm(p => ({...p, images:[...p.images,...d.paths]})); toast$(`${d.paths.length} image(s) uploaded`); }
    } catch { toast$('Upload failed','error'); }
    finally   { setUploading(false); }
  }

  function onDrop(e:React.DragEvent) { e.preventDefault(); setDragOver(false); upload(Array.from(e.dataTransfer.files)); }
  function onFile(e:React.ChangeEvent<HTMLInputElement>) { if (e.target.files) upload(Array.from(e.target.files)); }
  function removeImg(i:number) { setForm(p => ({...p, images:p.images.filter((_,j)=>j!==i)})); }

  function startEdit(p:Project) {
    setEditId(p.id);
    setForm({name:p.name, description:p.description, technologies:p.technologies.join(', '), images:p.images});
    window.scrollTo({top:0, behavior:'smooth'});
  }
  function cancel() { setEditId(null); setForm(empty); }

  async function submit(e:React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()||!form.description.trim()) { toast$('Name and description required','error'); return; }
    setSaving(true);
    try {
      const payload = {
        name:form.name, description:form.description,
        technologies:form.technologies.split(',').map(t=>t.trim()).filter(Boolean),
        images:form.images,
        ...(editId?{id:editId}:{}),
      };
      const r = await fetch('/api/projects',{method:editId?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if (r.ok) { toast$(editId?'Updated!':'Created!'); cancel(); load(); }
      else toast$('Save failed','error');
    } finally { setSaving(false); }
  }

  async function del(id:string) {
    const r = await fetch(`/api/projects?id=${id}`,{method:'DELETE'});
    if (r.ok) { toast$('Deleted'); setDeleteConfirm(null); load(); }
    else toast$('Delete failed','error');
  }

  return (
    <div className="min-h-screen bg-ink text-paper">

      {/* Toast */}
      {toast && (
        <div className={`animate-slide-in fixed top-6 right-6 z-50 px-6 py-3 font-mono text-sm shadow-xl ${
          toast.type==='success' ? 'bg-rust text-paper' : 'bg-red-800 text-paper'
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
        <Link href="/"
          className="font-mono text-[0.65rem] text-mist hover:text-rust border border-paper/10 hover:border-rust px-4 py-2 transition-colors">
          ← Portfolio
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid lg:grid-cols-5 gap-12">

        {/* ── FORM ── */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-28">
            <h2 className="font-display text-3xl text-paper mb-2">{editId?'Edit Project':'Add Project'}</h2>
            <p className="font-mono text-[0.65rem] text-mist mb-8">{editId?'Update project details':'Fill in details and upload images'}</p>

            <form onSubmit={submit} className="flex flex-col gap-6">
              {/* Name */}
              <div>
                <label className="block font-mono text-[0.6rem] text-rust uppercase tracking-[0.2em] mb-2">Project Name *</label>
                <input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                  placeholder="e.g. Fleet Management System"
                  className="w-full bg-paper/5 border border-paper/10 focus:border-rust text-paper text-sm px-4 py-3 outline-none transition-colors placeholder:text-mist/40" />
              </div>

              {/* Description */}
              <div>
                <label className="block font-mono text-[0.6rem] text-rust uppercase tracking-[0.2em] mb-2">Description *</label>
                <textarea required rows={5} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                  placeholder="Describe what the project does..."
                  className="w-full bg-paper/5 border border-paper/10 focus:border-rust text-paper text-sm px-4 py-3 outline-none resize-none transition-colors placeholder:text-mist/40" />
              </div>

              {/* Technologies */}
              <div>
                <label className="block font-mono text-[0.6rem] text-rust uppercase tracking-[0.2em] mb-2">
                  Technologies <span className="font-sans normal-case tracking-normal text-mist text-[0.7rem] ml-1">(comma-separated)</span>
                </label>
                <input type="text" value={form.technologies} onChange={e=>setForm({...form,technologies:e.target.value})}
                  placeholder="Node.js, NestJS, PostgreSQL..."
                  className="w-full bg-paper/5 border border-paper/10 focus:border-rust text-paper text-sm px-4 py-3 outline-none transition-colors placeholder:text-mist/40" />
                {form.technologies && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.technologies.split(',').filter(t=>t.trim()).map((t,i)=>(
                      <span key={i} className="font-mono text-[0.6rem] bg-rust/20 border border-rust/30 text-rust px-2 py-0.5">{t.trim()}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Drop zone */}
              <div>
                <label className="block font-mono text-[0.6rem] text-rust uppercase tracking-[0.2em] mb-2">Project Images</label>
                <div
                  onDragOver={e=>{e.preventDefault();setDragOver(true)}}
                  onDragLeave={()=>setDragOver(false)}
                  onDrop={onDrop}
                  onClick={()=>fileRef.current?.click()}
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
                      <div className="text-3xl mb-3 text-rust/40">{dragOver?'⬇':'⬆'}</div>
                      <div className="font-mono text-[0.7rem] text-paper/60 mb-1">{dragOver?'Drop files here':'Drag & drop images'}</div>
                      <div className="font-mono text-[0.6rem] text-mist">or click to browse · PNG, JPG, WEBP · multiple allowed</div>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFile} className="hidden" />

                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {form.images.map((img,i) => (
                      <div key={i} className="relative group aspect-video bg-paper/10 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={()=>removeImg(i)}
                          className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-paper text-lg hover:text-rust border-0 cursor-pointer transition-all">
                          ✕
                        </button>
                        {i===0 && <div className="absolute top-1 left-1 bg-rust font-mono text-[0.5rem] text-paper px-1.5 py-0.5">COVER</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

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

        {/* ── LIST ── */}
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
                <div key={p.id} className={`border transition-colors ${editId===p.id ? 'border-rust bg-rust/5' : 'border-paper/10 hover:border-paper/20'}`}>
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
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {p.technologies.slice(0,4).map(t=>(
                          <span key={t} className="font-mono text-[0.55rem] bg-paper/5 border border-paper/10 text-mist px-2 py-0.5">{t}</span>
                        ))}
                        {p.technologies.length>4 && <span className="font-mono text-[0.55rem] text-mist">+{p.technologies.length-4}</span>}
                      </div>
                      {p.images.length>0 && <div className="font-mono text-[0.55rem] text-rust mt-1.5">{p.images.length} image{p.images.length>1?'s':''}</div>}
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button onClick={()=>startEdit(p)}
                        className="font-mono text-[0.6rem] border border-paper/20 hover:border-rust text-mist hover:text-rust px-3 py-1.5 bg-transparent cursor-pointer transition-colors">
                        Edit
                      </button>
                      <button onClick={()=>setDeleteConfirm(p.id)}
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
              <button onClick={()=>del(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-paper font-mono text-[0.7rem] py-3 border-0 cursor-pointer transition-colors">
                Yes, Delete
              </button>
              <button onClick={()=>setDeleteConfirm(null)}
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
