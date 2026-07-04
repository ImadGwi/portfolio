import { db } from '@/lib/db';
import { stacks } from '@/db/schema';
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

// PUT update a stack by id
export async function PUT(request, { params }) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { name, type, level, experienceYears, icon, why, color, terminalText } = body;

    if (!name || !type) {
      return Response.json({ error: 'Name and type are required' }, { status: 400 });
    }

    const [updated] = await db.update(stacks)
      .set({ 
        name, 
        type, 
        level: level || null,
        experienceYears: experienceYears || null,
        icon: icon || null, 
        why: why || null, 
        color: color || null, 
        terminalText: terminalText || null, 
        updatedAt: new Date() 
      })
      .where(eq(stacks.id, parseInt(id)))
      .returning();

    if (!updated) return Response.json({ error: 'Stack not found' }, { status: 404 });

    return Response.json({ stack: updated }, { status: 200 });
  } catch (error) {
    console.error('UPDATE STACK ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a stack by id
export async function DELETE(request, { params }) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const [deleted] = await db.delete(stacks)
      .where(eq(stacks.id, parseInt(id)))
      .returning({ id: stacks.id });

    if (!deleted) return Response.json({ error: 'Stack not found' }, { status: 404 });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE STACK ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
