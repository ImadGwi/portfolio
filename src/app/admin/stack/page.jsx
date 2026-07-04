'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { StackForm } from '@/components/admin/StackForm';
import { Layers, Plus, Pencil, Trash2, Loader2, AlertCircle, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
const TYPE_ORDER = ['frontend', 'backend', 'database', 'devops', 'tool', 'communication', 'testing', 'mobile', 'other'];

const TYPE_COLORS = {
  frontend:      'bg-sky-500/10 text-sky-400 ring-sky-500/20',
  backend:       'bg-violet-500/10 text-violet-400 ring-violet-500/20',
  database:      'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  devops:        'bg-orange-500/10 text-orange-400 ring-orange-500/20',
  tool:          'bg-neutral-500/10 text-neutral-400 ring-neutral-500/20',
  communication: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  testing:       'bg-pink-500/10 text-pink-400 ring-pink-500/20',
  mobile:        'bg-cyan-500/10 text-cyan-400 ring-cyan-500/20',
  other:         'bg-neutral-500/10 text-neutral-400 ring-neutral-500/20',
};

const LEVEL_BADGE = {
  Beginner:     'bg-neutral-500/10 text-neutral-400',
  Intermediate: 'bg-sky-500/10 text-sky-400',
  Advanced:     'bg-indigo-500/10 text-indigo-400',
  Expert:       'bg-violet-500/10 text-violet-400',
};

function extractFormData(form) {
  const fd = new FormData(form);
  return {
    name:            fd.get('name') || '',
    type:            fd.get('type') || '',
    level:           fd.get('level') || null,
    experienceYears: fd.get('experienceYears') || null,
    color:           fd.get('colorText') || fd.get('color') || null,
    terminalText:    fd.get('terminalText') || null,
    why:             fd.get('why') || null,
    icon:            fd.get('icon') || null,
  };
}

// ------------------------------------------------------------------
// StackCard — individual item display
// ------------------------------------------------------------------
function StackCard({ stack, onEdit, onDelete, deleting }) {
  const isSvg = stack.icon && stack.icon.trim().startsWith('<svg');
  const isUrl = stack.icon && !isSvg && (stack.icon.trim().startsWith('http') || stack.icon.trim().startsWith('/'));

  return (
    <div
      className="group relative flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.06]"
      style={{ borderLeftColor: stack.color || undefined, borderLeftWidth: stack.color ? 3 : undefined }}
    >
      {/* Icon Space */}
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0a0a0a] ring-1 ring-white/5 overflow-hidden"
      >
        {isSvg ? (
          <span
            className="h-6 w-6 flex items-center justify-center icon-render text-white"
            dangerouslySetInnerHTML={{ __html: stack.icon }}
          />
        ) : isUrl ? (
          <img src={stack.icon} alt={stack.name} className="h-6 w-6 object-contain" />
        ) : (
          <span className="text-lg font-bold text-neutral-400 capitalize">{stack.name[0]}</span>
        )}
      </div>

      {/* Info Container */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="text-base font-bold text-white tracking-tight">{stack.name}</span>
          
          <div className="flex items-center gap-1.5">
            {stack.experienceYears && (
              <span className="text-[10px] font-bold text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                {stack.experienceYears}
              </span>
            )}
            {stack.level && (
              <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${LEVEL_BADGE[stack.level] || 'bg-neutral-500/10 text-neutral-400'}`}>
                {stack.level}
              </span>
            )}
          </div>
        </div>

        {stack.terminalText && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center justify-center h-4 w-4 rounded bg-white/5 border border-white/5">
               <Terminal className="h-2.5 w-2.5 text-neutral-500" />
            </div>
            <code className="text-[11px] text-neutral-400 font-mono tracking-tight bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
              {stack.terminalText}
            </code>
          </div>
        )}

        {stack.why && (
          <p className="mt-2 text-xs leading-relaxed text-neutral-500 italic max-w-lg line-clamp-2">
            "{stack.why}"
          </p>
        )}
      </div>

      {/* Hover Actions */}
      <div className="flex shrink-0 items-center gap-1 lg:opacity-0 transition-opacity lg:group-hover:opacity-100">
        <button
          onClick={() => onEdit(stack)}
          className="rounded-lg p-2.5 text-neutral-500 hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors"
          title="Edit Skill"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(stack.id)}
          disabled={deleting === stack.id}
          className="rounded-lg p-2.5 text-neutral-500 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-40"
          title="Delete Skill"
        >
          {deleting === stack.id
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Trash2 className="h-4 w-4" />
          }
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Main Page
// ------------------------------------------------------------------
export default function StackManagementPage() {
  const [stacksByType, setStacksByType] = useState({});
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);

  const [mode, setMode] = useState(null); // null | 'add' | { edit: stack }
  const [collapsed, setCollapsed] = useState({});

  const fetchStacks = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stacks');
      const data = await res.json();
      const grouped = {};
      TYPE_ORDER.forEach((t) => { grouped[t] = []; });
      (data.stacks || []).forEach((s) => {
        if (!grouped[s.type]) grouped[s.type] = [];
        grouped[s.type].push(s);
      });
      setStacksByType(grouped);
    } catch {
      setError('Failed to load stacks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStacks(); }, [fetchStacks]);

  // ── Add ──────────────────────────────────────────────────────────
  async function handleAdd(e) {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    const body = extractFormData(e.target);

    const res = await fetch('/api/admin/stacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setFormLoading(false);
    if (!res.ok) { setError('Failed to create stack.'); return; }
    setMode(null);
    fetchStacks();
  }

  // ── Edit ─────────────────────────────────────────────────────────
  async function handleEdit(e) {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    const { id } = mode.edit;
    const body = extractFormData(e.target);

    const res = await fetch(`/api/admin/stacks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setFormLoading(false);
    if (!res.ok) { setError('Failed to update stack.'); return; }
    setMode(null);
    fetchStacks();
  }

  // ── Delete ───────────────────────────────────────────────────────
  async function handleDelete(id) {
    if (!confirm('Delete this stack item?')) return;
    setDeleting(id);
    await fetch(`/api/admin/stacks/${id}`, { method: 'DELETE' });
    setDeleting(null);
    fetchStacks();
  }

  const toggleCollapse = (type) =>
    setCollapsed((p) => ({ ...p, [type]: !p[type] }));

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3 text-neutral-500">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm animate-pulse">Loading stacks...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
            <div className="flex items-center justify-center rounded-lg bg-indigo-500/20 p-2 text-indigo-400 ring-1 ring-indigo-400/20">
              <Layers className="h-5 w-5" />
            </div>
            Skills & Stack
          </h1>
          <p className="mt-1 text-sm text-neutral-400">Manage your technologies, tools and skills.</p>
        </div>
        {mode === null && (
          <Button
            onClick={() => setMode('add')}
            className="h-11 px-5 rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Stack
          </Button>
        )}
      </div>

      {/* ── Global error ── */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* ── Add Form ── */}
      {mode === 'add' && (
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 shadow-xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-indigo-400">New Stack Item</p>
          <StackForm onSubmit={handleAdd} onCancel={() => setMode(null)} loading={formLoading} />
        </div>
      )}

      {/* ── Edit Form ── */}
      {mode?.edit && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 shadow-xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-amber-400">Editing "{mode.edit.name}"</p>
          <StackForm initial={mode.edit} onSubmit={handleEdit} onCancel={() => setMode(null)} loading={formLoading} />
        </div>
      )}

      {/* ── Grouped list ── */}
      {TYPE_ORDER.map((type) => {
        const items = stacksByType[type] || [];
        if (items.length === 0) return null;

        return (
          <section key={type}>
            <button
              onClick={() => toggleCollapse(type)}
              className="mb-3 flex w-full items-center justify-between rounded-xl px-1 py-2 text-left group"
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ring-1 ${TYPE_COLORS[type]}`}>
                  {type}
                </span>
                <span className="text-xs text-neutral-600">{items.length} item{items.length !== 1 ? 's' : ''}</span>
              </div>
              {collapsed[type]
                ? <ChevronDown className="h-4 w-4 text-neutral-600 group-hover:text-white transition-colors" />
                : <ChevronUp className="h-4 w-4 text-neutral-600 group-hover:text-white transition-colors" />
              }
            </button>

            {!collapsed[type] && (
              <div className="space-y-3">
                {items.map((stack) => (
                  <StackCard
                    key={stack.id}
                    stack={stack}
                    onEdit={(s) => setMode({ edit: s })}
                    onDelete={handleDelete}
                    deleting={deleting}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {Object.values(stacksByType).every((a) => a.length === 0) && mode === null && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] py-20 gap-4 text-neutral-600">
          <Layers className="h-12 w-12 opacity-20" />
          <p className="text-sm font-medium">No stacks added yet.</p>
          <Button
            onClick={() => setMode('add')}
            className="h-10 px-5 rounded-xl bg-indigo-600/80 text-white text-sm hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Your First Stack
          </Button>
        </div>
      )}
    </div>
  );
}
