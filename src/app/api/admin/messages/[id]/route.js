import { db } from '@/lib/db';
import { messages } from '@/db/schema';
import { eq } from 'drizzle-orm';
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

// PATCH — update message (mark as read or update tag)
export async function PATCH(request, { params }) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { isRead, tag } = body;

    const updateData = {};
    if (isRead !== undefined) updateData.isRead = isRead;
    if (tag !== undefined) updateData.tag = tag;

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: 'No update data provided' }, { status: 400 });
    }

    const [updated] = await db.update(messages)
      .set(updateData)
      .where(eq(messages.id, parseInt(id)))
      .returning({ id: messages.id, isRead: messages.isRead, tag: messages.tag });

    if (!updated) return Response.json({ error: 'Message not found' }, { status: 404 });

    return Response.json({ success: true, message: updated }, { status: 200 });
  } catch (error) {
    console.error('PATCH MESSAGE ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE — remove message
export async function DELETE(request, { params }) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const [deleted] = await db.delete(messages)
      .where(eq(messages.id, parseInt(id)))
      .returning({ id: messages.id });

    if (!deleted) return Response.json({ error: 'Message not found' }, { status: 404 });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE MESSAGE ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
