// src/components/main/GlobalComments.jsx
'use client';

import { useEffect, useState } from 'react';

export default function GlobalComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ commenterName: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadComments = async () => {
    try {
      const res = await fetch('/api/comments', { cache: 'no-store' });
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadComments(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.commenterName.trim() || !form.body.trim()) {
      setError('Fill in your name and a comment.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, projectId: null }),
      });
      if (!res.ok) throw new Error('Failed to post comment');
      setForm({ commenterName: '', body: '' });
      await loadComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-black text-gray-200 font-mono px-6 py-16 max-w-5xl mx-auto">
      <p className="text-green-400 mb-6"># global_comments --list</p>

      <div className="space-y-4 mb-10">
        {loading && <p className="text-gray-500">loading...</p>}
        {!loading && comments.length === 0 && (
          <p className="text-gray-500">// no comments yet, be the first</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="border-l-2 border-green-600 pl-4">
            <p className="text-green-400 text-sm">{c.commenterName}</p>
            <p className="text-sm">{c.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="your name"
          value={form.commenterName}
          onChange={(e) => setForm({ ...form, commenterName: e.target.value })}
          className="w-full bg-[#0d1117] border border-green-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-400"
        />
        <textarea
          placeholder="write a comment..."
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          rows={3}
          className="w-full bg-[#0d1117] border border-green-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-400"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-black font-semibold px-4 py-2 rounded text-sm"
        >
          {submitting ? 'sending...' : 'submit'}
        </button>
      </form>
    </section>
  );
}