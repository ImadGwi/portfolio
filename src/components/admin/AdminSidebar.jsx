'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  User,
  Layers,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadCommentsCount, setUnreadCommentsCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUnreadCounts() {
      try {
        const [messagesRes, commentsRes] = await Promise.all([
          fetch('/api/admin/messages?countOnly=true'),
          fetch('/api/admin/comments?countOnly=true'),
        ]);

        if (messagesRes.ok) {
          const data = await messagesRes.json();
          setUnreadMessagesCount(data.unreadCount || 0);
        }

        if (commentsRes.ok) {
          const data = await commentsRes.json();
          setUnreadCommentsCount(data.unreadCount || 0);
        }
      } catch {
        // silently fail, badges are non-critical
      }
    }
    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 60_000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Dashboard',    href: '/admin',           icon: LayoutDashboard },
    { label: 'Projects',     href: '/admin/projects',  icon: FolderKanban },
    { label: 'Bio',          href: '/admin/bio',       icon: User },
    { label: 'Skills & Stack', href: '/admin/stack',   icon: Layers },
    { label: 'CV',           href: '/admin/cv',        icon: FileText },
    {
      label: 'Messages',
      href: '/admin/messages',
      icon: Mail,
      badge: unreadMessagesCount,
    },
    {
      label: 'Comments',
      href: '/admin/comments',
      icon: MessageSquare,
      badge: unreadCommentsCount,
    },
  ];

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-50 rounded-md bg-neutral-800 p-2 text-white md:hidden"
        aria-label="Toggle sidebar"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5 bg-neutral-900 transition-transform duration-300 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / Brand */}
        <div className="flex h-16 items-center border-b border-white/5 px-6">
          <span className="text-lg font-semibold tracking-tight text-white">
            Admin Panel
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          {navItems.map(({ label, href, icon: Icon, badge }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/8 text-white'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {badge > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-bold text-white">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/5 p-3">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-white/50 hover:bg-white/5 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
