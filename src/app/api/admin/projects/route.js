import { db } from '@/lib/db';
import { projects, projectStacks, projectSections, projectMedia } from '@/db/schema';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { desc, eq } from 'drizzle-orm';

const SESSION_COOKIE = 'admin_session';

async function getAdminPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'superAdmin') return null;
  return payload;
}

// GET all projects
export async function GET() {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));
    
    return Response.json({ projects: allProjects }, { status: 200 });
  } catch (error) {
    console.error('GET PROJECTS ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new project
export async function POST(request) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

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

    // Insert the main project
    const [insertedProject] = await db.insert(projects).values({
      title, slug, shortDescription, fullDescription, problem, solution, 
      githubUrl, liveUrl, coverImage, coverpageUrl, role, status, duration, 
      isPublished: isPublished || false,
      isFeatured: isFeatured || false,
      isHide: isHide || false,
    }).returning();

    const projectId = insertedProject.id;

    // Insert stacks
    if (stacks.length > 0) {
      await db.insert(projectStacks).values(
        stacks.map((stackId) => ({ projectId, stackId }))
      );
    }

    // Insert sections
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

    // Insert media
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

    return Response.json({ project: insertedProject }, { status: 201 });
  } catch (error) {
    console.error('POST PROJECT ERROR:', error);
    // Let's handle unique constraint violations for slug if possible.
    if (error.code === '23505') {
      return Response.json({ error: 'A project with this slug already exists.' }, { status: 400 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
