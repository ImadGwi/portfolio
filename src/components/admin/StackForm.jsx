import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save, X } from 'lucide-react';

const STACK_TYPES = [
  'frontend', 'backend', 'database', 'devops',
  'tool', 'communication', 'testing', 'mobile', 'other',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export function StackForm({ initial = {}, onSubmit, onCancel, loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Name <span className="text-red-400">*</span>
          </Label>
          <Input
            name="name"
            defaultValue={initial.name || ''}
            placeholder="React"
            required
            className="h-11 rounded-xl bg-[#0a0a0a] border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-indigo-500/30"
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Type <span className="text-red-400">*</span>
          </Label>
          <select
            name="type"
            defaultValue={initial.type || ''}
            required
            className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-neutral-800 text-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all capitalize"
          >
            <option value="" disabled>Select type...</option>
            {STACK_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">{t}</option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Level
          </Label>
          <select
            name="level"
            defaultValue={initial.level || ''}
            className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-neutral-800 text-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
          >
            <option value="">Select level...</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Experience Years */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Experience (Years)
          </Label>
          <Input
            name="experienceYears"
            type="text"
            defaultValue={initial.experienceYears || ''}
            placeholder="e.g. 5+ years"
            className="h-11 rounded-xl bg-[#0a0a0a] border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-indigo-500/30"
          />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Brand Color
          </Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              name="color"
              defaultValue={initial.color || '#6366f1'}
              className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-neutral-800 bg-[#0a0a0a] p-1"
            />
            <Input
              name="colorText"
              defaultValue={initial.color || '#6366f1'}
              placeholder="#6366f1"
              className="h-11 rounded-xl bg-[#0a0a0a] border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-indigo-500/30 font-mono"
            />
          </div>
        </div>

        {/* Terminal Text */}
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Terminal Text
          </Label>
          <Input
            name="terminalText"
            defaultValue={initial.terminalText || ''}
            placeholder="npm install react"
            className="h-11 rounded-xl bg-[#0a0a0a] border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-indigo-500/30 font-mono"
          />
        </div>
      </div>

      {/* Why */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Why Do You Use It? <span className="text-neutral-600">(optional)</span>
        </Label>
        <Input
          name="why"
          defaultValue={initial.why || ''}
          placeholder="My go-to library for building fast, component-based UIs..."
          className="h-11 rounded-xl bg-[#0a0a0a] border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-indigo-500/30"
        />
      </div>

      {/* SVG Icon */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          SVG Icon Code <span className="text-neutral-600">(optional)</span>
        </Label>
        <textarea
          name="icon"
          defaultValue={initial.icon || ''}
          placeholder={'<svg viewBox="0 0 24 24" ...>...</svg>'}
          rows={4}
          className="w-full rounded-xl bg-[#0a0a0a] border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all p-4 text-sm font-mono resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="h-11 px-6 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50"
        >
          {loading
            ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</>
            : <><Save className="h-4 w-4 mr-2" />Save Stack</>
          }
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="ghost"
            className="h-11 px-5 rounded-xl text-neutral-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
