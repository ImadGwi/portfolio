import { db } from '@/lib/db';
import { comments } from '@/db/schema';
import { and, eq, isNull, or } from 'drizzle-orm';
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

export async function PATCH(request, { params }) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const commentId = Number.parseInt(id, 10);
    if (!Number.isInteger(commentId) || commentId <= 0) {
      return Response.json({ error: 'Invalid comment id' }, { status: 400 });
    }

    const body = await request.json();
    const updateData = { updatedAt: new Date() };

    if (body.isRead !== undefined) updateData.isRead = Boolean(body.isRead);
    if (body.isHidden !== undefined) updateData.isHidden = Boolean(body.isHidden);
    if (body.isPriority !== undefined) updateData.isPriority = Boolean(body.isPriority);

    if (Object.keys(updateData).length === 1) {
      return Response.json({ error: 'No update data provided' }, { status: 400 });
    }

    const [updated] = await db
      .update(comments)
      .set(updateData)
      .where(and(eq(comments.id, commentId), eq(comments.isAdminReply, false), isNull(comments.parentId)))
      .returning({
        id: comments.id,
        isRead: comments.isRead,
        isHidden: comments.isHidden,
        isPriority: comments.isPriority,
      });

    if (!updated) return Response.json({ error: 'Comment not found' }, { status: 404 });

    return Response.json({ success: true, comment: updated }, { status: 200 });
  } catch (error) {
    console.error('PATCH COMMENT ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const commentId = Number.parseInt(id, 10);
    if (!Number.isInteger(commentId) || commentId <= 0) {
      return Response.json({ error: 'Invalid comment id' }, { status: 400 });
    }

    const [existing] = await db
      .select({
        id: comments.id,
        parentId: comments.parentId,
      })
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (!existing) return Response.json({ error: 'Comment not found' }, { status: 404 });

    const rootId = existing.parentId ?? existing.id;

    await db
      .delete(comments)
      .where(or(eq(comments.id, rootId), eq(comments.parentId, rootId)));

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE COMMENT ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
