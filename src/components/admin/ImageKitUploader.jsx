import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UploadCloud, X, Image as ImageIcon } from 'lucide-react';

export function ImageKitUploader({ folder, onSuccess, onError, buttonText = "Upload Image", accept = "image/*" }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e) {
    if (e) e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const authRes = await fetch('/api/imagekit-auth');
      if (!authRes.ok) throw new Error('Failed to get auth signature.');
      
      const { token, expire, signature, publicKey } = await authRes.json();
      if (!signature) throw new Error('ImageKit config missing');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name || 'upload');
      formData.append('publicKey', publicKey);
      formData.append('signature', signature);
      formData.append('expire', expire.toString());
      formData.append('token', token);
      formData.append('folder', folder || '/portfolio/projects');
      formData.append('useUniqueFileName', 'true');

      const ikRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      const ikData = await ikRes.json();
      if (!ikRes.ok) throw new Error(ikData.message || 'Upload failed.');

      // Provide the URL directly back to the parent
      onSuccess(ikData.url, ikData.filePath);
      setFile(null); // Clear input
    } catch (err) {
      console.error('Upload Error:', err);
      if (onError) onError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="relative flex-1">
        <Input
          type="file"
          accept={accept}
          onChange={(e) => {
            setFile(e.target.files?.[0]);
          }}
          className="h-10 cursor-pointer file:cursor-pointer file:text-white file:bg-white/10 file:hover:bg-white/20 file:border-0 file:mr-4 file:px-4 file:h-full file:rounded-xl file:font-semibold file:transition-colors bg-[#0a0a0a] border-neutral-800 text-neutral-300 focus-visible:ring-indigo-500/50"
        />
        {file && (
          <button
            type="button"
            onClick={() => setFile(null)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button
        type="button"
        onClick={handleUpload}
        disabled={!file || uploading}
        className="h-10 shrink-0 rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Uploading...
          </>
        ) : (
          <>
            <UploadCloud className="h-4 w-4 mr-2" /> {buttonText}
          </>
        )}
      </Button>
    </div>
  );
}
