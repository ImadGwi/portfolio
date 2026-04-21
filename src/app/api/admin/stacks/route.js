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

// GET all stacks
export async function GET() {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const allStacks = await db.select().from(stacks).orderBy(stacks.type, stacks.name);
    return Response.json({ stacks: allStacks }, { status: 200 });
  } catch (error) {
    console.error('GET STACKS ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new stack
export async function POST(request) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, type, level, experienceYears, icon, why, color, terminalText } = body;

    if (!name || !type) {
      return Response.json({ error: 'Name and type are required' }, { status: 400 });
    }

    const [newStack] = await db.insert(stacks).values({
      name,
      type,
      level: level || null,
      experienceYears: experienceYears || null,
      icon: icon || null,
      why: why || null,
      color: color || null,
      terminalText: terminalText || null,
    }).returning();

    return Response.json({ stack: newStack }, { status: 201 });
  } catch (error) {
    console.error('CREATE STACK ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
