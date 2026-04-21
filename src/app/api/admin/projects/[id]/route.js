import { db } from '@/lib/db';
import { projects, projectStacks, projectSections, projectMedia } from '@/db/schema';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';

const SESSION_COOKIE = 'admin_session';

async function getAdminPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'superAdmin') return null;
  return payload;
}

// GET single project with relations
export async function GET(request, { params }) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const projectId = parseInt(id);

    const [project] = await db.select().from(projects).where(eq(projects.id, projectId));
    if (!project) return Response.json({ error: 'Project not found' }, { status: 404 });

    const stacks = await db.select().from(projectStacks).where(eq(projectStacks.projectId, projectId));
    const sections = await db.select().from(projectSections).where(eq(projectSections.projectId, projectId)).orderBy(projectSections.order);
    const media = await db.select().from(projectMedia).where(eq(projectMedia.projectId, projectId)).orderBy(projectMedia.order);

    return Response.json({ project, stacks, sections, media }, { status: 200 });
  } catch (error) {
    console.error('GET PROJECT ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update project & relations
export async function PUT(request, { params }) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const projectId = parseInt(id);

    const body = await request.json();
    const { 
      title, slug, shortDescription, fullDescription, problem, solution, 
      githubUrl, liveUrl, coverImage, coverpageUrl, role, status, duration, 
      isPublished, isFeatured, isHide,
      stacks = [], // Array of stack IDs
      sections = [], // Array of section objects
      media = [] // Array of media objects
    } = body;

    if (!title || !slug) {
      return Response.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    // 1. Update main project
    const [updated] = await db.update(projects).set({
      title, slug, shortDescription, fullDescription, problem, solution, 
      githubUrl, liveUrl, coverImage, coverpageUrl, role, status, duration, 
      isPublished: isPublished || false,
      isFeatured: isFeatured || false,
      isHide: isHide || false,
      updatedAt: new Date()
    }).where(eq(projects.id, projectId)).returning();

    if (!updated) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    // 2. Update stacks (delete all existing for this project, insert new)
    await db.delete(projectStacks).where(eq(projectStacks.projectId, projectId));
    if (stacks.length > 0) {
      await db.insert(projectStacks).values(
        stacks.map((stackId) => ({ projectId, stackId }))
      );
    }

    // 3. Update sections (delete all, insert new)
    await db.delete(projectSections).where(eq(projectSections.projectId, projectId));
    if (sections.length > 0) {
      await db.insert(projectSections).values(
        sections.map((sec, index) => ({
          projectId,
          title: sec.title || null,
          content: sec.content || null,
          order: index
        }))
      );
    }

    // 4. Update media (delete all, insert new)
    await db.delete(projectMedia).where(eq(projectMedia.projectId, projectId));
    if (media.length > 0) {
      await db.insert(projectMedia).values(
        media.map((m, index) => ({
          projectId,
          url: m.url,
          type: m.type || 'image',
          text: m.text || null,
          order: index
        }))
      );
    }

    return Response.json({ success: true, project: updated }, { status: 200 });
  } catch (error) {
    console.error('PUT PROJECT ERROR:', error);
    if (error.code === '23505') {
      return Response.json({ error: 'A project with this slug already exists.' }, { status: 400 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE project & manually cascade
export async function DELETE(request, { params }) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const projectId = parseInt(id);

    // Manual cascade delete as requested
    await db.delete(projectStacks).where(eq(projectStacks.projectId, projectId));
    await db.delete(projectSections).where(eq(projectSections.projectId, projectId));
    await db.delete(projectMedia).where(eq(projectMedia.projectId, projectId));
    
    // Finally, delete the main project
    await db.delete(projects).where(eq(projects.id, projectId));

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE PROJECT ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
