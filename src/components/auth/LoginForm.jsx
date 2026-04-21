'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPass = searchParams.get('pass') || '';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, urlPass }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please try again.');
        return;
      }

      router.push(data.redirect || '/admin');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center space-y-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
          <ShieldCheck className="h-9 w-9 text-white" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Admin Panel
          </h1>
          <p className="mt-2 text-sm font-medium text-neutral-400">
            Secure authentication required
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-semibold tracking-wide text-neutral-200">
            Username
          </Label>
          <div className="relative">
            <Input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="h-12 w-full rounded-xl border-neutral-800 bg-neutral-900/50 px-4 text-white placeholder:text-neutral-600 transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold tracking-wide text-neutral-200">
            Password
          </Label>
          <div className="relative group">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="h-12 w-full rounded-xl border-neutral-800 bg-neutral-900/50 px-4 pr-12 text-white placeholder:text-neutral-600 transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-500 transition-colors hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-in fade-in slide-in-from-top-1 duration-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="relative h-12 w-full overflow-hidden rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Authenticating...</span>
            </div>
          ) : (
            <span>Continue to Dashboard</span>
          )}
        </Button>
      </form>

      {/* Footer hint */}
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-600">
        Personal Administration System
      </p>
    </div>
  );
}
