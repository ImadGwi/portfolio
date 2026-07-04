import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <AdminSidebar />

      {/* Main content — offset on desktop to account for sidebar */}
      <main className="min-h-screen transition-all duration-300 md:pl-64">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
