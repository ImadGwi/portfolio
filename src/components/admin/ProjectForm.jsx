'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageKitUploader } from '@/components/admin/ImageKitUploader';
import { Loader2, Save, X, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

export function ProjectForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data States
  const [formData, setFormData] = useState({
    title: initialData?.project?.title || '',
    slug: initialData?.project?.slug || '',
    shortDescription: initialData?.project?.shortDescription || '',
    fullDescription: initialData?.project?.fullDescription || '',
    problem: initialData?.project?.problem || '',
    solution: initialData?.project?.solution || '',
    githubUrl: initialData?.project?.githubUrl || '',
    liveUrl: initialData?.project?.liveUrl || '',
    coverImage: initialData?.project?.coverImage || '',
    coverpageUrl: initialData?.project?.coverpageUrl || '',
    role: initialData?.project?.role || '',
    status: initialData?.project?.status || '',
    duration: initialData?.project?.duration || '',
    isPublished: initialData?.project?.isPublished || false,
    isFeatured: initialData?.project?.isFeatured || false,
    isHide: initialData?.project?.isHide || false,
  });

  const [availableStacks, setAvailableStacks] = useState([]);
  const [selectedStacks, setSelectedStacks] = useState(
    initialData?.stacks?.map(s => s.stackId) || []
  );

  const [sections, setSections] = useState(
    initialData?.sections || []
  );

  const [media, setMedia] = useState(
    initialData?.media || []
  );

  useEffect(() => {
    async function fetchStacks() {
      const res = await fetch('/api/admin/stacks');
      const data = await res.json();
      if (data.stacks) setAvailableStacks(data.stacks);
    }
    fetchStacks();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSlugify = () => {
    if (formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  };

  const toggleStack = (id) => {
    setSelectedStacks(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  // Section Handlers
  const addSection = () => setSections(prev => [...prev, { title: '', content: '', order: prev.length }]);
  const removeSection = (index) => setSections(prev => prev.filter((_, i) => i !== index));
  const updateSection = (index, field, value) => {
    setSections(prev => {
      const newSecs = [...prev];
      newSecs[index][field] = value;
      return newSecs;
    });
  };
  const moveSection = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;
    const newSecs = [...sections];
    const temp = newSecs[index];
    newSecs[index] = newSecs[index + (direction === 'up' ? -1 : 1)];
    newSecs[index + (direction === 'up' ? -1 : 1)] = temp;
    setSections(newSecs);
  };

  // Media Handlers
  const addMedia = () => setMedia(prev => [...prev, { url: '', type: 'image', text: '', order: prev.length }]);
  const removeMedia = (index) => setMedia(prev => prev.filter((_, i) => i !== index));
  const updateMedia = (index, field, value) => {
    setMedia(prev => {
      const newMedia = [...prev];
      newMedia[index][field] = value;
      return newMedia;
    });
  };
  const moveMedia = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === media.length - 1) return;
    const newMedia = [...media];
    const temp = newMedia[index];
    newMedia[index] = newMedia[index + (direction === 'up' ? -1 : 1)];
    newMedia[index + (direction === 'up' ? -1 : 1)] = temp;
    setMedia(newMedia);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      stacks: selectedStacks,
      sections,
      media
    };

    const url = initialData ? `/api/admin/projects/${initialData.project.id}` : '/api/admin/projects';
    const method = initialData ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/admin/projects');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save project');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400 font-medium">
          {error}
        </div>
      )}

      {/* --- Section 1: Basic Info --- */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold border-b border-white/10 pb-2">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input name="title" value={formData.title} onChange={handleChange} required className="bg-neutral-900 border-white/10" />
          </div>
          <div className="space-y-2">
            <Label className="flex justify-between items-center">
              <span>Slug *</span>
              <button type="button" onClick={handleSlugify} className="text-xs text-indigo-400 hover:text-indigo-300">Auto-generate</button>
            </Label>
            <Input name="slug" value={formData.slug} onChange={handleChange} required className="bg-neutral-900 border-white/10" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Short Description</Label>
            <Input name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="bg-neutral-900 border-white/10" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Full Description</Label>
            <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} className="w-full rounded-xl bg-neutral-900 border border-white/10 p-4 text-sm resize-y min-h-[100px]" />
          </div>
        </div>
      </section>

      {/* --- Section 2: URLs & Images --- */}
      <section className="space-y-6 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
        <h2 className="text-xl font-bold border-b border-white/10 pb-2">Media & Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cover Page URL (Main Grid Image)</Label>
              <Input name="coverpageUrl" value={formData.coverpageUrl} onChange={handleChange} className="bg-neutral-900 border-white/10 mb-2" />
              <ImageKitUploader 
                folder="/projects/covers" 
                buttonText="Upload Cover"
                onSuccess={(url) => setFormData(prev => ({...prev, coverpageUrl: url}))} 
              />
              {formData.coverpageUrl && <img src={formData.coverpageUrl} className="mt-2 rounded-lg border border-white/10 h-32 object-cover object-center w-full" />}
            </div>
            <div className="space-y-2 pt-4">
              <Label>Banner Image (Secondary)</Label>
              <Input name="coverImage" value={formData.coverImage} onChange={handleChange} className="bg-neutral-900 border-white/10 mb-2" />
              <ImageKitUploader 
                folder="/projects/banners" 
                buttonText="Upload Banner"
                onSuccess={(url) => setFormData(prev => ({...prev, coverImage: url}))} 
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>GitHub URL</Label>
              <Input name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="bg-neutral-900 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Live URL</Label>
              <Input name="liveUrl" value={formData.liveUrl} onChange={handleChange} className="bg-neutral-900 border-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Deep Dive (Problem/Solution) --- */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold border-b border-white/10 pb-2">Deep Dive</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Problem</Label>
            <textarea name="problem" value={formData.problem} onChange={handleChange} className="w-full rounded-xl bg-neutral-900 border border-white/10 p-4 text-sm resize-y min-h-[150px]" />
          </div>
          <div className="space-y-2">
            <Label>Solution</Label>
            <textarea name="solution" value={formData.solution} onChange={handleChange} className="w-full rounded-xl bg-neutral-900 border border-white/10 p-4 text-sm resize-y min-h-[150px]" />
          </div>
        </div>
      </section>

      {/* --- Section 4: Metadata --- */}
      <section className="space-y-6 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
        <h2 className="text-xl font-bold border-b border-white/10 pb-2">Metadata</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <Label>Role</Label>
            <Input name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Lead Frontend" className="bg-neutral-900 border-white/10" />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select name="status" value={formData.status} onChange={handleChange} className="h-10 w-full rounded-md bg-neutral-900 border border-white/10 px-3 text-sm">
              <option value="">Select...</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Duration</Label>
            <Input name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 3 Months" className="bg-neutral-900 border-white/10" />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-6 pt-4 border-t border-white/5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} className="w-4 h-4 rounded border-white/20 bg-neutral-900 text-indigo-600 focus:ring-indigo-500" />
            <span>Published</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 rounded border-white/20 bg-neutral-900 text-indigo-600 focus:ring-indigo-500" />
            <span>Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-red-400">
            <input type="checkbox" name="isHide" checked={formData.isHide} onChange={handleChange} className="w-4 h-4 rounded border-red-500/50 bg-neutral-900 text-red-500 focus:ring-red-500" />
            <span>Hidden (Draft mode)</span>
          </label>
        </div>
      </section>

      {/* --- Section 5: Tech Stack --- */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b border-white/10 pb-2">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {availableStacks.map(stack => (
            <button
              key={stack.id}
              type="button"
              onClick={() => toggleStack(stack.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                selectedStacks.includes(stack.id)
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                  : 'bg-neutral-900 text-neutral-500 border-white/5 hover:border-white/20'
              }`}
            >
              {stack.name}
            </button>
          ))}
        </div>
      </section>

      {/* --- Section 6: Dynamic Sections --- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className="text-xl font-bold">Custom Sections</h2>
          <Button type="button" onClick={addSection} size="sm" variant="outline" className="h-8">
            <Plus className="h-4 w-4 mr-2" /> Add Section
          </Button>
        </div>
        
        <div className="space-y-4">
          {sections.map((sec, index) => (
            <div key={index} className="flex gap-4 items-start bg-neutral-900 p-4 rounded-xl border border-white/5 relative group">
              <div className="flex flex-col gap-1 mt-1">
                <button type="button" onClick={() => moveSection(index, 'up')} className="p-1 text-neutral-500 hover:text-white"><ArrowUp className="h-4 w-4" /></button>
                <button type="button" onClick={() => moveSection(index, 'down')} className="p-1 text-neutral-500 hover:text-white"><ArrowDown className="h-4 w-4" /></button>
              </div>
              <div className="flex-1 space-y-4">
                <Input placeholder="Section Title" value={sec.title} onChange={(e) => updateSection(index, 'title', e.target.value)} className="bg-black border-white/10 font-bold" />
                <textarea placeholder="Section Content" value={sec.content} onChange={(e) => updateSection(index, 'content', e.target.value)} className="w-full rounded-xl bg-black border border-white/10 p-4 text-sm resize-y min-h-[100px]" />
              </div>
              <button type="button" onClick={() => removeSection(index)} className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {sections.length === 0 && <p className="text-sm text-neutral-500">No custom sections added.</p>}
        </div>
      </section>

      {/* --- Section 7: Media Gallery --- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className="text-xl font-bold">Media Gallery</h2>
          <Button type="button" onClick={addMedia} size="sm" variant="outline" className="h-8">
            <Plus className="h-4 w-4 mr-2" /> Add Media
          </Button>
        </div>

        <div className="space-y-4">
          {media.map((m, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-4 items-start bg-neutral-900 p-4 rounded-xl border border-white/5">
              <div className="flex flex-row sm:flex-col gap-1 mt-1">
                <button type="button" onClick={() => moveMedia(index, 'up')} className="p-1 text-neutral-500 hover:text-white"><ArrowUp className="h-4 w-4" /></button>
                <button type="button" onClick={() => moveMedia(index, 'down')} className="p-1 text-neutral-500 hover:text-white"><ArrowDown className="h-4 w-4" /></button>
              </div>
              
              {m.url && m.type === 'image' && (
                <div className="w-24 h-24 shrink-0 rounded-lg border border-white/10 overflow-hidden bg-black">
                  <img src={m.url} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex-1 space-y-3 w-full">
                <div className="flex gap-2 w-full">
                  <select value={m.type} onChange={(e) => updateMedia(index, 'type', e.target.value)} className="h-10 rounded-md bg-black border border-white/10 px-3 text-sm">
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <Input placeholder="Media URL" value={m.url} onChange={(e) => updateMedia(index, 'url', e.target.value)} className="bg-black border-white/10 flex-1" />
                </div>
                <ImageKitUploader 
                  folder="/projects/gallery" 
                  buttonText="Upload Media"
                  onSuccess={(url) => updateMedia(index, 'url', url)} 
                />
                <Input placeholder="Caption text (optional)" value={m.text || ''} onChange={(e) => updateMedia(index, 'text', e.target.value)} className="bg-black border-white/10" />
              </div>
              <button type="button" onClick={() => removeMedia(index)} className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {media.length === 0 && <p className="text-sm text-neutral-500">No media gallery items added.</p>}
        </div>
      </section>

      {/* --- Actions --- */}
      <div className="sticky bottom-6 z-20 flex items-center justify-end gap-4 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl shrink-0 shadow-2xl">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/projects')} className="text-neutral-400 hover:text-white">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {initialData ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
