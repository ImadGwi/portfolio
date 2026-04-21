'use client';

import { useState, useEffect, use } from 'react';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { FolderKanban, Loader2, AlertCircle } from 'lucide-react';

export default function EditProjectPage({ params }) {
  // In Next.js 15, route params must be awaited via React.use()
  const { id } = use(params);
  
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/admin/projects/${id}`);
        const data = await res.json();
        
        if (res.ok) {
          setInitialData(data);
        } else {
          setError(data.error || 'Failed to fetch project');
        }
      } catch (err) {
        setError('An unexpected error occurred while loading.');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3 text-neutral-500">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm animate-pulse">Loading project data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl space-y-8 pb-20">
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white mb-2">
          <div className="flex items-center justify-center rounded-lg bg-amber-500/20 p-2 text-amber-400 ring-1 ring-amber-400/20">
            <FolderKanban className="h-5 w-5" />
          </div>
          Edit Project
        </h1>
        <p className="text-sm text-neutral-400 border-b border-white/10 pb-6">
          Updating details for: <span className="text-white font-semibold">{initialData?.project?.title}</span>
        </p>
      </div>
      
      <ProjectForm initialData={initialData} />
    </div>
  );
}
