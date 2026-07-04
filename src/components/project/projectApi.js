// src/components/project/projectApi.js
// Project-specific data functions — same pattern as mainApi.js.
// Comment read/post already exist generically in mainApi.js (they already
// handle projectId, including null for global comments), so we just
// re-export them here under the names the project components expect.

import { getComments, postComment } from '@/components/main/mainApi';

const BASE = process.env.API_BASE_URL || 'http://localhost:3100';

// ---------------------------------------------------------------------------
// getProjectBySlug  →  GET /api/projects/[slug]
// Returns: { project, stacks, sections, media }
// ---------------------------------------------------------------------------
export async function getProjectBySlug(slug) {
  try {
    const res = await fetch(`${BASE}/api/projects/${slug}`, { cache: 'no-store' });
    if (!res.ok) return { project: null, stacks: [], sections: [], media: [] };
    return await res.json();
  } catch {
    return { project: null, stacks: [], sections: [], media: [] };
  }
}

// ---------------------------------------------------------------------------
// Re-exported from mainApi.js, aliased for clarity within project components
// ---------------------------------------------------------------------------
export { getComments as getProjectComments, postComment as postProjectComment };