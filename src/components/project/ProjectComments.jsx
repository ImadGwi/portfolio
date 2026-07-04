// src/components/project/ProjectComments.jsx
'use client';

import { useEffect, useState } from 'react';
import { getProjectComments, postProjectComment } from '@/components/project/projectApi';

export default function ProjectComments({ projectId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ commenterName: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadComments = async () => {
    setLoading(true);
    const data = await getProjectComments(projectId);
    setComments(data.comments || []);
    setLoading(false);
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.commenterName.trim() || !form.body.trim()) {
      setError('Please add your name and a comment.');
      return;
    }

    setSubmitting(true);
    try {
      await postProjectComment({ ...form, projectId });
      setForm({ commenterName: '', body: '' });
      await loadComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-sm tracking-widest uppercase mb-6" style={{ color: 'var(--chrome)' }}>
        Discussion
      </h2>

      <div className="space-y-4 mb-8">
        {loading && <p style={{ color: 'var(--text-dim)' }}>Loading comments...</p>}
        {!loading && comments.length === 0 && (
          <p style={{ color: 'var(--text-dim)' }}>No comments yet — be the first to share your thoughts.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="border-l-2 pl-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--chrome)' }}>{c.commenterName}</p>
            <p className="text-sm" style={{ color: 'var(--text)' }}>{c.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your name"
          value={form.commenterName}
          onChange={(e) => setForm({ ...form, commenterName: e.target.value })}
          className="w-full rounded border px-3 py-2 text-sm focus:outline-none"
          style={{ background: 'var(--bg-pane)', borderColor: 'var(--border)', color: 'var(--text)' }}
        />
        <textarea
          placeholder="Share your thoughts..."
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          rows={3}
          className="w-full rounded border px-3 py-2 text-sm focus:outline-none"
          style={{ background: 'var(--bg-pane)', borderColor: 'var(--border)', color: 'var(--text)' }}
        />
        {error && <p className="text-sm" style={{ color: '#e05252' }}>{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="text-sm px-4 py-2 rounded font-medium disabled:opacity-50"
          style={{ background: '#7ee787', color: 'var(--bg)' }}
        >
          {submitting ? 'Posting...' : 'Post comment'}
        </button>
      </form>
    </section>
  );
}