import { db } from '@/lib/db';
import { comments } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';

async function getAdminPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'superAdmin') return null;
  return payload;
}

export async function POST(request, { params }) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const rootCommentId = Number.parseInt(id, 10);
    if (!Number.isInteger(rootCommentId) || rootCommentId <= 0) {
      return Response.json({ error: 'Invalid comment id' }, { status: 400 });
    }

    const bodyData = await request.json();
    const replyBody = typeof bodyData.body === 'string' ? bodyData.body.trim() : '';

    if (!replyBody) {
      return Response.json({ error: 'Reply body is required' }, { status: 400 });
    }

    const [rootComment] = await db
      .select({
        id: comments.id,
        projectId: comments.projectId,
      })
      .from(comments)
      .where(and(
        eq(comments.id, rootCommentId),
        eq(comments.isAdminReply, false),
        isNull(comments.parentId),
      ))
      .limit(1);

    if (!rootComment) {
      return Response.json({ error: 'Root comment not found' }, { status: 404 });
    }

    const [existingReply] = await db
      .select({ id: comments.id })
      .from(comments)
      .where(and(
        eq(comments.parentId, rootCommentId),
        eq(comments.isAdminReply, true),
      ))
      .limit(1);

    if (existingReply) {
      return Response.json({ error: 'Admin reply already exists for this comment' }, { status: 409 });
    }

    const [reply] = await db
      .insert(comments)
      .values({
        projectId: rootComment.projectId,
        parentId: rootComment.id,
        commenterName: payload.username || 'Admin',
        body: replyBody,
        isAdminReply: true,
        isRead: true,
        isHidden: false,
        isPriority: false,
      })
      .returning({
        id: comments.id,
        parentId: comments.parentId,
        commenterName: comments.commenterName,
        body: comments.body,
        createdAt: comments.createdAt,
      });

    return Response.json({ reply }, { status: 201 });
  } catch (error) {
    if (error?.code === '23505') {
      return Response.json({ error: 'Admin reply already exists for this comment' }, { status: 409 });
    }
    console.error('POST COMMENT REPLY ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
