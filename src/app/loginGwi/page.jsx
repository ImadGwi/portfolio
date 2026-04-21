import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Secure Admin Login | Portfolio',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505]">
      {/* --- Background Elements --- */}
      
      {/* Primary Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] opacity-50"
        aria-hidden="true"
      />
      
      {/* Secondary Glows for depth */}
      <div 
        className="absolute -top-[10%] -right-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]"
        aria-hidden="true"
      />
      <div 
        className="absolute -bottom-[10%] -left-[10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]"
        aria-hidden="true"
      />

      {/* Grid Texture */}
      <div
        className="absolute inset-0 z-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* --- Login Container --- */}
      <section className="relative z-10 w-full px-4 flex justify-center">
        <div className="w-full max-w-md p-1 rounded-[2.5rem] bg-gradient-to-b from-white/10 via-white/5 to-white/0 shadow-2xl">
          <div className="w-full h-full p-10 md:p-12 rounded-[2.3rem] bg-[#0a0a0a] border border-white/5 backdrop-blur-3xl">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center space-y-4 py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                <p className="text-sm font-medium text-neutral-400 font-mono tracking-widest uppercase">INITIALIZING</p>
              </div>
            }>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Subtle Bottom Light */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
    </main>
  );
}
