import { ProjectForm } from '@/components/admin/ProjectForm';
import { FolderKanban } from 'lucide-react';

export const metadata = {
  title: 'Create Project - Admin',
};

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white mb-2">
          <div className="flex items-center justify-center rounded-lg bg-indigo-500/20 p-2 text-indigo-400 ring-1 ring-indigo-400/20">
            <FolderKanban className="h-5 w-5" />
          </div>
          Create New Project
        </h1>
        <p className="text-sm text-neutral-400 border-b border-white/10 pb-6">
          Add comprehensive details for your new portfolio case study.
        </p>
      </div>
      
      <ProjectForm />
    </div>
  );
}
