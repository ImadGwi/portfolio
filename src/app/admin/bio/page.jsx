'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, User, Save, AlertCircle, CheckCircle2, Eye, Code } from 'lucide-react';

export default function BioManagementPage() {
  const [bioHtml, setBioHtml] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [status, setStatus] = useState(null);

  // Fetch current bio on load
  useEffect(() => {
    async function fetchBio() {
      try {
        const res = await fetch('/api/admin/bio');
        if (res.ok) {
          const data = await res.json();
          setBioHtml(data.bio || '');
        }
      } catch (err) {
        console.error('Error fetching bio:', err);
      } finally {
        setLoadingInitial(false);
      }
    }
    fetchBio();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch('/api/admin/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bioHtml }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save bio');
      }

      setBioHtml(data.bio); // Update with the sanitized version from server
      setStatus({ type: 'success', message: 'Biography saved and secured successfully!' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  }

  if (loadingInitial) {
    return (
      <div className="flex h-[400px] items-center justify-center space-y-4 flex-col text-neutral-400">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium animate-pulse">Loading Bio Editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
            <div className="flex items-center justify-center rounded-lg bg-indigo-500/20 p-2 text-indigo-400 ring-1 ring-indigo-400/20">
              <User className="h-5 w-5" />
            </div>
            Bio Management
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Write your story using HTML. Changes are sanitized for security.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-11 px-6 rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" /> Save Biography
            </span>
          )}
        </Button>
      </div>

      {status && (
        <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm animate-in zoom-in-95 duration-200 ${
          status.type === 'error' 
            ? 'border-red-500/20 bg-red-500/10 text-red-400' 
            : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
        }`}>
          {status.type === 'error' ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span className="font-medium leading-relaxed">{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* --- HTML Editor --- */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
              <Code className="h-4 w-4" /> HTML Editor
            </Label>
          </div>
          <div className="relative flex-1 group">
            <textarea
              value={bioHtml}
              onChange={(e) => {
                setBioHtml(e.target.value);
                if (status) setStatus(null);
              }}
              spellCheck={false}
              placeholder="<h1>My Story</h1><p>...</p>"
              className="w-full h-[600px] bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 text-sm font-mono text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all resize-none shadow-2xl"
            />
            <div className="absolute top-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold text-neutral-600 bg-neutral-900 px-2 py-1 rounded">RAW HTML</span>
            </div>
          </div>
        </div>

        {/* --- Live Preview --- */}
        <div className="flex flex-col space-y-4">
          <Label className="text-xs font-semibold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
            <Eye className="h-4 w-4" /> Live Preview
          </Label>
          <div className="flex-1 rounded-2xl border border-white/5 bg-white/[0.02] p-8 shadow-2xl overflow-y-auto max-h-[600px] backdrop-blur-3xl relative">
            {/* Subtle glow in preview */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl opacity-50 pointer-events-none" />
            
            {bioHtml ? (
              <div 
                className="prose prose-invert prose-indigo max-w-none break-words"
                dangerouslySetInnerHTML={{ __html: bioHtml }}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-4">
                <div className="rounded-full bg-white/5 p-4">
                  <User className="h-8 w-8 opacity-20" />
                </div>
                <p className="text-sm font-medium">Your rendered bio will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
