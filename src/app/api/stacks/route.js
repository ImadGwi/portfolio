import { db } from '@/lib/db';
import { stacks } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const allStacks = await db
      .select()
      .from(stacks)
      .orderBy(asc(stacks.type), asc(stacks.name));

    return Response.json({ stacks: allStacks });
  } catch (error) {
    console.error('GET /api/stacks error:', error);
    return Response.json({ stacks: [] });
  }
}
