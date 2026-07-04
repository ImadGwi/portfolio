// src/components/main/MessageForm.jsx
'use client';

import { useState } from 'react';

export default function MessageForm() {
  const [form, setForm] = useState({ name: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.body.trim()) {
      setError('Merci de renseigner votre nom et un message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Échec de l'envoi du message");
      setForm({ name: '', body: '' });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border border-green-900/60 bg-black/30 backdrop-blur-sm rounded-lg text-gray-200 font-mono px-5 py-8 h-full">
      <h2 className="text-green-400 mb-2 text-base">Message privé</h2>
      <p className="text-gray-500 text-xs mb-6">
        Envoyé directement, non visible publiquement.
      </p>

      {sent ? (
        <p className="text-green-400 text-sm border-l-2 border-green-600 pl-4">
          Message envoyé, merci !
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="votre nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-black/40 border border-green-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-400"
          />
          <textarea
            placeholder="votre message..."
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={4}
            className="w-full bg-black/40 border border-green-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-400"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-black font-semibold px-4 py-2 rounded text-sm"
          >
            {submitting ? 'envoi...' : 'envoyer'}
          </button>
        </form>
      )}
    </section>
  );
}