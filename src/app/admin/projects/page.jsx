'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FolderKanban, Plus, Pencil, Trash2, Loader2, AlertCircle, Eye, EyeOff, LayoutTemplate } from 'lucide-react';

export default function ProjectsListPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects || []);
      } else {
        setError(data.error || 'Failed to fetch projects');
      }
    } catch {
      setError('An unexpected error occurred while fetching projects.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project? This will also delete all related sections and media.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete project');
      }
    } catch {
      alert('An unexpected error occurred.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3 text-neutral-500">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm animate-pulse">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
            <div className="flex items-center justify-center rounded-lg bg-indigo-500/20 p-2 text-indigo-400 ring-1 ring-indigo-400/20">
              <FolderKanban className="h-5 w-5" />
            </div>
            Projects Projects
          </h1>
          <p className="mt-1 text-sm text-neutral-400">Manage your portfolio projects and case studies.</p>
        </div>
        <Button asChild className="h-11 px-5 rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.98]">
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4 mr-2" /> Create Project
          </Link>
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] py-24 gap-4 text-neutral-600">
          <LayoutTemplate className="h-12 w-12 opacity-20" />
          <p className="text-sm font-medium">No projects added yet.</p>
          <Button asChild className="h-10 px-5 rounded-xl bg-indigo-600/80 text-white text-sm hover:bg-indigo-500">
            <Link href="/admin/projects/new">
              <Plus className="h-4 w-4 mr-2" /> Add Your First Project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className={`group relative flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all hover:border-white/10 hover:bg-white/[0.04] ${project.isHide ? 'opacity-50' : ''}`}>
              {/* Cover Image Placeholder */}
              <div className="aspect-[16/9] w-full bg-neutral-900 border-b border-white/5 relative">
                {project.coverpageUrl ? (
                  <img src={project.coverpageUrl} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-700">
                    <LayoutTemplate className="h-8 w-8" />
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ring-1 ${project.isPublished ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' : 'bg-amber-500/10 text-amber-400 ring-amber-500/20'}`}>
                    {project.isPublished ? 'Published' : 'Draft'}
                  </span>
                  {project.isFeatured && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ring-1 bg-violet-500/10 text-violet-400 ring-violet-500/20">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white truncate text-lg group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-mono mt-1">/{project.slug}</p>
                  </div>
                  {project.isHide ? (
                    <EyeOff className="h-4 w-4 text-neutral-600 shrink-0" title="Hidden" />
                  ) : (
                    <Eye className="h-4 w-4 text-emerald-600 shrink-0" title="Visible" />
                  )}
                </div>

                <p className="mt-3 text-sm text-neutral-400 line-clamp-2 flex-1">
                  {project.shortDescription || 'No description provided.'}
                </p>

                {/* Actions */}
                <div className="mt-5 flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                  <Button asChild variant="ghost" size="sm" className="h-9 px-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg">
                    <Link href={`/admin/projects/${project.id}`}>
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    disabled={deleting === project.id}
                    className="h-9 px-3 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    {deleting === project.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
