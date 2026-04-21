'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, Trash2, CheckCircle2, Loader2, AlertCircle, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TAG_COLORS = {
  job:       'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  freelance: 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20',
  spam:      'bg-red-500/10 text-red-400 ring-red-500/20',
  question:  'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  other:     'bg-neutral-500/10 text-neutral-400 ring-neutral-500/20',
};

const TAGS = ['job', 'freelance', 'spam', 'question', 'other'];

function MessageCard({ message, onUpdate, onDelete, updating }) {
  const isUnread = !message.isRead;
  const date = new Date(message.createdAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });

  return (
    <div className={`relative rounded-2xl border transition-all ${
      isUnread 
        ? 'border-indigo-500/30 bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.05)]' 
        : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
    } p-6`}>
      
      {/* Unread Indicator */}
      {isUnread && (
        <span className="absolute top-6 left-0 h-10 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className={`text-base truncate ${isUnread ? 'font-bold text-white' : 'font-semibold text-neutral-300'}`}>
              {message.name}
            </h3>
            <span className="text-xs text-neutral-500 font-mono bg-black/20 px-2 py-0.5 rounded-md truncate">
              {message.email}
            </span>
            {message.tag && (
              <select
                value={message.tag}
                disabled={updating === message.id}
                onChange={(e) => onUpdate(message.id, { tag: e.target.value })}
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ring-1 bg-transparent cursor-pointer hover:scale-105 transition-transform appearance-none ${TAG_COLORS[message.tag] || TAG_COLORS.other}`}
              >
                {TAGS.map((t) => (
                  <option key={t} value={t} className="bg-neutral-900 lowercase">{t}</option>
                ))}
              </select>
            )}
          </div>
          
          <p className={`text-sm mb-3 truncate ${isUnread ? 'text-neutral-200 font-medium' : 'text-neutral-400'}`}>
            {message.subject || 'No Subject'}
          </p>

          <div className="bg-black/20 rounded-xl p-4 text-sm text-neutral-400 whitespace-pre-wrap leading-relaxed border border-white/5">
            {message.body}
          </div>
        </div>

        <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
          <div className="text-xs text-neutral-500 font-medium whitespace-nowrap">
            {date}
          </div>
          
          <div className="flex items-center gap-2">
            {isUnread && (
              <Button
                variant="ghost"
                size="icon"
                disabled={updating === message.id}
                onClick={() => onUpdate(message.id, { isRead: true })}
                className="h-11 w-11 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 rounded-xl"
                title="Mark as Read"
              >
                {updating === message.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              disabled={updating === message.id}
              onClick={() => onDelete(message.id)}
              className="h-11 w-11 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
              title="Delete Message"
            >
              {updating === message.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesManagementPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      } else {
        setError(data.error || 'Failed to fetch messages');
      }
    } catch {
      setError('An unexpected error occurred while fetching messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleUpdateMessage = async (id, data) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessages((prev) => prev.map((m) => m.id === id ? { ...m, ...data } : m));
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to update message');
      }
    } catch {
      alert('An unexpected error occurred.');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete message');
      }
    } catch {
      alert('An unexpected error occurred.');
    } finally {
      setUpdating(null);
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  if (loading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3 text-neutral-500">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm animate-pulse">Checking inbox...</p>
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
              <Mail className="h-5 w-5" />
            </div>
            Messages
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}.
          </p>
        </div>
      </div>

      {/* ── Global error ── */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* ── Messages List ── */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] py-24 gap-4 text-neutral-600">
            <Inbox className="h-12 w-12 opacity-20" />
            <p className="text-sm font-medium">Your inbox is empty.</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageCard 
              key={message.id} 
              message={message} 
              onUpdate={handleUpdateMessage}
              onDelete={handleDelete}
              updating={updating}
            />
          ))
        )}
      </div>
    </div>
  );
}
