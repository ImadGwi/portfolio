// src/components/main/mainApi.js
// Public-facing data functions — each one calls its corresponding API route.
// Server Components use the absolute base URL; Client Components use the same
// functions (or call the API directly as GlobalComments already does).

const BASE = process.env.API_BASE_URL || 'http://localhost:3100';

// ---------------------------------------------------------------------------
// 1. getBio  →  GET /api/bio
// Returns: { bio: string }
// ---------------------------------------------------------------------------
export async function getBio() {
  try {
    const res = await fetch(`${BASE}/api/bio`, { cache: 'no-store' });
    if (!res.ok) return { bio: '' };
    return await res.json();
  } catch {
    return { bio: '' };
  }
}

// ---------------------------------------------------------------------------
// 2. getStacks  →  GET /api/stacks
// Returns: { stacks: Stack[] }
// ---------------------------------------------------------------------------
export async function getStacks() {
  try {
    const res = await fetch(`${BASE}/api/stacks`, { next: { revalidate: 60 } });
    if (!res.ok) return { stacks: [] };
    return await res.json();
  } catch {
    return { stacks: [] };
  }
}

// ---------------------------------------------------------------------------
// 5. getProjects  →  GET /api/projects
// Returns: { projects: Project[] }
// ---------------------------------------------------------------------------
export async function getProjects() {
  try {
    const res = await fetch(`${BASE}/api/projects`, { cache: 'no-store' });
    if (!res.ok) return { projects: [] };
    return await res.json();
  } catch {
    return { projects: [] };
  }
}

// ---------------------------------------------------------------------------
// 3. getComments(projectId?)  →  GET /api/comments[?projectId=n]
// Returns: { comments: Comment[] }
// ---------------------------------------------------------------------------
export async function getComments(projectId = null) {
  try {
    const url =
      projectId != null
        ? `${BASE}/api/comments?projectId=${projectId}`
        : `${BASE}/api/comments`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { comments: [] };
    return await res.json();
  } catch {
    return { comments: [] };
  }
}

// ---------------------------------------------------------------------------
// 4. postComment  →  POST /api/comments
// Returns: { comment: Comment }  — throws on validation / server error
// ---------------------------------------------------------------------------
export async function postComment({ commenterName, body, projectId = null, parentId = null }) {
  const res = await fetch(`${BASE}/api/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commenterName, body, projectId, parentId }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to post comment');
  }

  return await res.json();
}
