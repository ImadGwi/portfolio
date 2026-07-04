import { db } from '@/lib/db';
import { messages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
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

// GET all messages + unread count
export async function GET(request) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get('countOnly') === 'true';

    if (countOnly) {
      const unread = await db.select({ id: messages.id })
        .from(messages)
        .where(eq(messages.isRead, false));
      return Response.json({ unreadCount: unread.length }, { status: 200 });
    }

    const allMessages = await db.select().from(messages).orderBy(desc(messages.createdAt));
    const unread = allMessages.filter((m) => !m.isRead).length;

    return Response.json({ messages: allMessages, unreadCount: unread }, { status: 200 });
  } catch (error) {
    console.error('GET MESSAGES ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
