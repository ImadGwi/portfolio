// src/app/api/projects/[slug]/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, projectStacks, stacks, projectSections, projectMedia } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    // console.log(slug, 'slug');
    

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.slug, slug), eq(projects.isPublished, true), eq(projects.isHide, false)));

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const stackRows = await db
      .select({
        id: stacks.id,
        name: stacks.name,
        type: stacks.type,
        level: stacks.level,
        icon: stacks.icon,
        color: stacks.color,
      })
      .from(projectStacks)
      .innerJoin(stacks, eq(projectStacks.stackId, stacks.id))
      .where(eq(projectStacks.projectId, project.id));

    const sections = await db
      .select()
      .from(projectSections)
      .where(eq(projectSections.projectId, project.id))
      .orderBy(asc(projectSections.order));

    const media = await db
      .select()
      .from(projectMedia)
      .where(eq(projectMedia.projectId, project.id))
      .orderBy(asc(projectMedia.order));

    return NextResponse.json({ project, stacks: stackRows, sections, media });
  } catch (error) {
    console.error('GET /api/projects/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to load project' }, { status: 500 });
  }
}