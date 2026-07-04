// src/components/main/CommentsSection.jsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

const LIMIT = 7;

export default function CommentsSection() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState({ commenterName: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadComments = useCallback(async (targetPage) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: String(LIMIT),
      });
      const res = await fetch(`/api/comments?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      setComments(data.comments || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadComments(page); }, [page, loadComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.commenterName.trim() || !form.body.trim()) {
      setError('Renseignez votre nom et un commentaire.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, projectId: null }),
      });
      if (!res.ok) throw new Error("Échec de l'envoi du commentaire");
      setForm({ commenterName: '', body: '' });
      setPage(1);
      await loadComments(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPage(p);
  };

  const renderPageLinks = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={i === page}
              onClick={(e) => { e.preventDefault(); goToPage(i); }}
              href="#"
              className={
                i === page
                  ? 'bg-green-600 text-black border border-green-500 hover:bg-green-500 hover:text-black'
                  : 'text-green-400 border border-green-800 hover:bg-green-900/40 hover:text-green-300'
              }
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === page - 2 || i === page + 2) {
        items.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis className="text-green-700" />
          </PaginationItem>
        );
      }
    }
    return items;
  };

  return (
    <section className="border border-green-900/60 bg-black/30 backdrop-blur-sm rounded-lg text-gray-200 font-mono px-6 py-8 h-full">
      <h2 className="text-green-400 mb-6 text-lg">Commentaires</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="votre nom"
          value={form.commenterName}
          onChange={(e) => setForm({ ...form, commenterName: e.target.value })}
          className="w-full bg-black/40 border border-green-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-400"
        />
        <textarea
          placeholder="écrire un commentaire..."
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          rows={3}
          className="w-full bg-black/40 border border-green-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-400"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-black font-semibold px-4 py-2 rounded text-sm"
        >
          {submitting ? 'envoi...' : 'envoyer'}
        </button>
      </form>

      <div className="space-y-4 mb-6">
        {loading && <p className="text-gray-500">chargement...</p>}
        {!loading && comments.length === 0 && (
          <p className="text-gray-500">Aucun commentaire pour l&apos;instant, soyez le premier.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="border-l-2 border-green-600 pl-4">
            <p className="text-green-400 text-sm">{c.commenterName}</p>
            <p className="text-sm">{c.body}</p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mb-8 justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); goToPage(page - 1); }}
                className={`text-green-400 border border-green-800 hover:bg-green-900/40 hover:text-green-300 ${
                  page === 1 ? 'pointer-events-none opacity-40' : ''
                }`}
              />
            </PaginationItem>
            {renderPageLinks()}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); goToPage(page + 1); }}
                className={`text-green-400 border border-green-800 hover:bg-green-900/40 hover:text-green-300 ${
                  page === totalPages ? 'pointer-events-none opacity-40' : ''
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      
    </section>
  );
}