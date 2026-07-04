import { db } from '@/lib/db';
import { comments, projects } from '@/db/schema';
import { eq, isNull, and, asc ,count } from 'drizzle-orm';

// src/app/api/comments/route.js
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectIdParam = searchParams.get('projectId');
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.max(1, Number(searchParams.get('limit')) || 5);
    const offset = (page - 1) * limit;

    const condition =
      projectIdParam != null
        ? and(eq(comments.projectId, Number(projectIdParam)), eq(comments.isHidden, false))
        : and(isNull(comments.projectId), eq(comments.isHidden, false));

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(comments)
        .where(condition)
        .orderBy(asc(comments.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(comments)
        .where(condition),
    ]);

    const total = totalResult[0]?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return Response.json({ comments: rows, total, totalPages, page, limit });
  } catch (error) {
    console.error('GET /api/comments error:', error);
    return Response.json({ comments: [], total: 0, totalPages: 1, page: 1, limit: 5 });
  }
}

export async function POST(request) {
  try {
    const bodyData = await request.json();
    const commenterName = typeof bodyData.commenterName === 'string' ? bodyData.commenterName.trim() : '';
    const body = typeof bodyData.body === 'string' ? bodyData.body.trim() : '';

    if (!commenterName) {
      return Response.json({ error: 'Commenter name is required' }, { status: 400 });
    }

    if (!body) {
      return Response.json({ error: 'Comment body is required' }, { status: 400 });
    }

    let projectId = null;
    if (bodyData.projectId !== null && bodyData.projectId !== undefined && bodyData.projectId !== '') {
      const parsed = Number.parseInt(bodyData.projectId, 10);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        return Response.json({ error: 'Invalid projectId' }, { status: 400 });
      }

      const [project] = await db
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.id, parsed))
        .limit(1);

      if (!project) {
        return Response.json({ error: 'Project not found' }, { status: 404 });
      }

      projectId = parsed;
    }

    const [inserted] = await db
      .insert(comments)
      .values({
        projectId,
        parentId: null,
        commenterName,
        body,
        isAdminReply: false,
        isRead: false,
        isHidden: false,
        isPriority: false,
      })
      .returning({
        id: comments.id,
        projectId: comments.projectId,
        commenterName: comments.commenterName,
        body: comments.body,
        createdAt: comments.createdAt,
      });

    return Response.json({ comment: inserted }, { status: 201 });
  } catch (error) {
    console.error('POST COMMENT ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
