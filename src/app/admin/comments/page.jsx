'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  MessageSquare,
  Loader2,
  AlertCircle,
  Inbox,
  CheckCircle2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  CornerDownLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatDate(value) {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function ScopeTabs({ scope, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-white/10 bg-black/20 p-1">
      <button
        type="button"
        onClick={() => onChange('project')}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
          scope === 'project'
            ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        Project Comments
      </button>
      <button
        type="button"
        onClick={() => onChange('general')}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
          scope === 'general'
            ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        General Comments
      </button>
    </div>
  );
}

function CommentCard({
  comment,
  updating,
  onUpdate,
  onDelete,
  onReply,
  replyDraft,
  setReplyDraft,
  replying,
  replyOpen,
  setReplyOpen,
}) {
  const isUnread = !comment.isRead;

  return (
    <div
      className={`relative rounded-2xl border p-6 transition-all ${
        comment.isHidden
          ? 'border-amber-500/20 bg-amber-500/[0.04]'
          : isUnread
            ? 'border-indigo-500/30 bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.05)]'
            : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
      } ${comment.isPriority ? 'ring-1 ring-indigo-400/20' : ''}`}
    >
      {isUnread && (
        <span className="absolute left-0 top-6 h-10 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`text-base ${isUnread ? 'font-bold text-white' : 'font-semibold text-neutral-300'}`}>
            {comment.commenterName}
          </h3>

          {comment.projectId ? (
            <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300 ring-1 ring-violet-400/20">
              Project: {comment.projectTitle || `#${comment.projectId}`}
            </span>
          ) : (
            <span className="rounded-full bg-neutral-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 ring-1 ring-neutral-500/20">
              General
            </span>
          )}

          {comment.isPriority && (
            <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300 ring-1 ring-indigo-500/30">
              Priority
            </span>
          )}

          {comment.isHidden && (
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 ring-1 ring-amber-500/30">
              Hidden
            </span>
          )}

          <span className="ml-auto text-xs text-neutral-500">{formatDate(comment.createdAt)}</span>
        </div>

        <div className="rounded-xl border border-white/5 bg-black/20 p-4 text-sm leading-relaxed text-neutral-300 whitespace-pre-wrap">
          {comment.body}
        </div>

        {comment.reply && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-300">Admin Reply</p>
            <p className="text-sm leading-relaxed text-emerald-100 whitespace-pre-wrap">{comment.reply.body}</p>
            <p className="mt-2 text-xs text-emerald-300/70">{formatDate(comment.reply.createdAt)}</p>
          </div>
        )}

        {!comment.reply && replyOpen === comment.id && (
          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <textarea
              value={replyDraft}
              onChange={(event) => setReplyDraft(comment.id, event.target.value)}
              placeholder="Write admin reply..."
              className="min-h-[110px] w-full rounded-xl border border-white/10 bg-neutral-900 p-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <div className="mt-3 flex items-center gap-2">
              <Button
                type="button"
                onClick={() => onReply(comment.id)}
                disabled={replying === comment.id}
                className="h-10 rounded-xl bg-indigo-600 px-4 font-semibold text-white hover:bg-indigo-500"
              >
                {replying === comment.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CornerDownLeft className="mr-2 h-4 w-4" />}
                Send Reply
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setReplyOpen(null)}
                className="h-10 rounded-xl px-4 text-neutral-400 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
          {isUnread && (
            <Button
              type="button"
              variant="ghost"
              disabled={updating === comment.id}
              onClick={() => onUpdate(comment.id, { isRead: true })}
              className="h-10 rounded-xl text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200"
            >
              {updating === comment.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              Mark Read
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            disabled={updating === comment.id}
            onClick={() => onUpdate(comment.id, { isHidden: !comment.isHidden })}
            className="h-10 rounded-xl text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
          >
            {comment.isHidden ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
            {comment.isHidden ? 'Unhide' : 'Hide'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            disabled={updating === comment.id}
            onClick={() => onUpdate(comment.id, { isPriority: !comment.isPriority })}
            className="h-10 rounded-xl text-violet-300 hover:bg-violet-500/10 hover:text-violet-200"
          >
            <ArrowUp className="mr-2 h-4 w-4" />
            {comment.isPriority ? 'Unpin' : 'Pin Top'}
          </Button>

          {!comment.reply && (
            <Button
              type="button"
              variant="ghost"
              disabled={replying === comment.id}
              onClick={() => setReplyOpen(replyOpen === comment.id ? null : comment.id)}
              className="h-10 rounded-xl text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200"
            >
              <CornerDownLeft className="mr-2 h-4 w-4" />
              Reply
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            disabled={updating === comment.id}
            onClick={() => onDelete(comment.id)}
            className="ml-auto h-10 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200"
          >
            {updating === comment.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCommentsPage() {
  const [scope, setScope] = useState('project');
  const [comments, setComments] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [replying, setReplying] = useState(null);
  const [replyOpen, setReplyOpen] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});

  const handleScopeChange = (nextScope) => {
    setReplyOpen(null);
    setScope(nextScope);
  };

  const fetchComments = useCallback(async (targetScope) => {
    try {
      const res = await fetch(`/api/admin/comments?scope=${targetScope}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch comments');
        return;
      }

      setComments(data.comments || []);
      setUnreadCount(data.unreadCount || 0);
      setError(null);
    } catch {
      setError('An unexpected error occurred while fetching comments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComments(scope);
  }, [scope, fetchComments]);

  const handleUpdateComment = async (id, patch) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to update comment');
        return;
      }

      setComments((prev) =>
        prev.map((comment) => (comment.id === id ? { ...comment, ...patch } : comment))
      );

      if (patch.isRead === true) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      if (patch.isPriority !== undefined) {
        setComments((prev) =>
          [...prev].sort((a, b) => {
            if (a.isPriority === b.isPriority) {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return a.isPriority ? -1 : 1;
          })
        );
      }
    } catch {
      alert('An unexpected error occurred.');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!confirm('Delete this comment thread and its admin reply?')) return;

    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to delete comment');
        return;
      }

      const deletedComment = comments.find((comment) => comment.id === id);
      setComments((prev) => prev.filter((comment) => comment.id !== id));

      if (deletedComment && !deletedComment.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      alert('An unexpected error occurred.');
    } finally {
      setUpdating(null);
    }
  };

  const setReplyDraft = (commentId, value) => {
    setReplyDrafts((prev) => ({ ...prev, [commentId]: value }));
  };

  const handleReply = async (commentId) => {
    const body = (replyDrafts[commentId] || '').trim();
    if (!body) {
      alert('Reply body is required.');
      return;
    }

    setReplying(commentId);
    try {
      const res = await fetch(`/api/admin/comments/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to send reply');
        return;
      }

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                reply: data.reply,
              }
            : comment
        )
      );

      setReplyDrafts((prev) => ({ ...prev, [commentId]: '' }));
      setReplyOpen(null);
    } catch {
      alert('An unexpected error occurred.');
    } finally {
      setReplying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3 text-neutral-500">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm animate-pulse">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
            <div className="flex items-center justify-center rounded-lg bg-emerald-500/20 p-2 text-emerald-400 ring-1 ring-emerald-400/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            Comments
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            You have {unreadCount} unread comment{unreadCount !== 1 ? 's' : ''} in this section.
          </p>
        </div>

        <ScopeTabs scope={scope} onChange={handleScopeChange} />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] py-24 text-neutral-600">
            <Inbox className="h-12 w-12 opacity-20" />
            <p className="text-sm font-medium">
              {scope === 'project' ? 'No project comments yet.' : 'No general comments yet.'}
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              updating={updating}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
              onReply={handleReply}
              replyDraft={replyDrafts[comment.id] || ''}
              setReplyDraft={setReplyDraft}
              replying={replying}
              replyOpen={replyOpen}
              setReplyOpen={setReplyOpen}
            />
          ))
        )}
      </div>
    </div>
  );
}
