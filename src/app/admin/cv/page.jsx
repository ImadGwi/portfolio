'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, FileCheck, UploadCloud, AlertCircle, Eye, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CvManagementPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [currentCv, setCurrentCv] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Fetch current CV on load
  const fetchCv = async () => {
    try {
      const res = await fetch('/api/admin/cv');
      if (res.ok) {
        const data = await res.json();
        setCurrentCv(data.cvUrl); // This is now a securely signed URL
      }
    } catch (err) {
      console.error('Error fetching CV:', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    fetchCv();
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatus(null);

    try {
      const authRes = await fetch('/api/imagekit-auth');
      if (!authRes.ok) throw new Error('Failed to get auth signature.');
      
      const { token, expire, signature, publicKey } = await authRes.json();
      if (!signature) throw new Error('ImageKit configuration missing on server.');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name || 'cv.pdf');
      formData.append('publicKey', publicKey);
      formData.append('signature', signature);
      formData.append('expire', expire.toString());
      formData.append('token', token);
      formData.append('folder', '/portfolio/cv');
      formData.append('useUniqueFileName', 'true');
      
      // CRITICAL: Upload as private file securely
      formData.append('isPrivateFile', 'true');

      const ikRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      const ikData = await ikRes.json();
      if (!ikRes.ok) throw new Error(ikData.message || 'Upload to ImageKit failed.');

      // Save the returned FILE PATH to the Database securely, not the direct URL
      const dbRes = await fetch('/api/admin/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvFilePath: ikData.filePath }),
      });

      if (!dbRes.ok) throw new Error('Failed to save CV filepath to database.');

      setStatus({ type: 'success', message: 'CV securely uploaded and saved!' });
      
      // Refresh the signed URL preview
      await fetchCv();
      setFile(null); // Reset form
      
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'An unexpected error occurred.' });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
          <div className="flex items-center justify-center rounded-lg bg-indigo-500/20 p-2 text-indigo-400 ring-1 ring-indigo-400/20">
            <FileCheck className="h-5 w-5" />
          </div>
          CV Management
        </h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-neutral-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Secure storage active. CV files are strictly private and require signed URLs to access.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 shadow-xl relative overflow-hidden backdrop-blur-3xl shrink-0">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl opacity-50 pointer-events-none" />

          <form onSubmit={handleUpload} className="relative z-10 flex flex-col sm:flex-row gap-6 items-end">
            <div className="space-y-3 flex-1 w-full">
              <Label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Update CV File (PDF)
              </Label>
              <div className="relative">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    setFile(e.target.files?.[0]);
                    if (status) setStatus(null);
                  }}
                  className="h-12 w-full cursor-pointer file:cursor-pointer file:text-white file:bg-white/10 file:hover:bg-white/20 file:border-0 file:mr-4 file:px-4 file:h-full file:rounded-xl file:font-semibold file:transition-colors bg-[#0a0a0a] border-neutral-800 text-neutral-300 focus-visible:ring-indigo-500/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!file || uploading}
              className="h-12 w-full sm:w-[200px] shrink-0 rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-50"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Securing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UploadCloud className="h-5 w-5" /> Upload Securely
                </span>
              )}
            </Button>
          </form>

          {status && (
            <div className={`mt-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm animate-in zoom-in-95 duration-200 ${
              status.type === 'error' 
                ? 'border-red-500/20 bg-red-500/10 text-red-400' 
                : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
            }`}>
              {status.type === 'error' ? (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span className="font-medium leading-relaxed">{status.message}</span>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 shadow-xl flex flex-col h-[800px] md:h-[1000px] w-full">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
              <Eye className="h-4 w-4" /> Current Preview (Signed URL)
            </h2>
            {currentCv && (
              <a 
                href={currentCv} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors bg-indigo-500/10 px-3 py-1.5 rounded-full"
              >
                Open Temporary Link <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          
          <div className="flex-1 w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden relative group">
            {loadingInitial ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 gap-3">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Authenticating preview...</span>
              </div>
            ) : currentCv ? (
              <iframe 
                src={`${currentCv}#toolbar=0`} 
                title="CV Preview"
                className="w-full h-full border-none bg-neutral-100"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 gap-3">
                <FileCheck className="h-10 w-10 opacity-50" />
                <span className="text-sm font-medium">No secure CV uploaded yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
