import {
  FolderKanban,
  Mail,
  User,
  Layers,
  FileText,
  MessageSquare,
} from 'lucide-react';

const stats = [
  { label: 'Projects', icon: FolderKanban, href: '/admin/projects', color: 'from-violet-500/20 to-violet-500/5' },
  { label: 'Messages', icon: Mail, href: '/admin/messages', color: 'from-blue-500/20 to-blue-500/5' },
  { label: 'Comments', icon: MessageSquare, href: '/admin/comments', color: 'from-emerald-500/20 to-emerald-500/5' },
  { label: 'Bio', icon: User, href: '/admin/bio', color: 'from-orange-500/20 to-orange-500/5' },
  { label: 'Stack & Skills', icon: Layers, href: '/admin/stack', color: 'from-pink-500/20 to-pink-500/5' },
  { label: 'CV', icon: FileText, href: '/admin/cv', color: 'from-yellow-500/20 to-yellow-500/5' },
];

export const metadata = {
  title: 'Dashboard',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/40">Welcome back. Manage your portfolio content below.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, icon: Icon, href, color }) => (
          <a
            key={label}
            href={href}
            className={`group relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br ${color} p-6 transition-all hover:border-white/10 hover:shadow-lg`}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-white/10 p-3 transition-colors group-hover:bg-white/15">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-base font-medium text-white">{label}</span>
            </div>
            <div className="mt-4 text-xs font-bold uppercase tracking-widest text-white/30 transition-colors group-hover:text-indigo-400">
              Manage Section →
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
