import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const list = await db
      .select()
      .from(projects)
      .where(and(eq(projects.isPublished, true), eq(projects.isHide, false)))
      .orderBy(desc(projects.isFeatured), desc(projects.createdAt));

    return NextResponse.json({ projects: list });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 });
  }
}
