import { db } from '@/lib/db';
import { comments, projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request) {
  try {
    const bodyData = await request.json();
    const commenterName = typeof bodyData.commenterName === 'string' ? bodyData.commenterName.trim() : '';
    const body = typeof bodyData.body === 'string' ? bodyData.body.trim() : '';

    if (!commenterName) {
      return Response.json({ error: 'Commenter name is required' }, { status: 400 });
    }

    if (!body) {
      return Response.json({ error: 'Comment body is required' }, { status: 400 });
    }

    let projectId = null;
    if (bodyData.projectId !== null && bodyData.projectId !== undefined && bodyData.projectId !== '') {
      const parsed = Number.parseInt(bodyData.projectId, 10);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        return Response.json({ error: 'Invalid projectId' }, { status: 400 });
      }

      const [project] = await db
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.id, parsed))
        .limit(1);

      if (!project) {
        return Response.json({ error: 'Project not found' }, { status: 404 });
      }

      projectId = parsed;
    }

    const [inserted] = await db
      .insert(comments)
      .values({
        projectId,
        parentId: null,
        commenterName,
        body,
        isAdminReply: false,
        isRead: false,
        isHidden: false,
        isPriority: false,
      })
      .returning({
        id: comments.id,
        projectId: comments.projectId,
        commenterName: comments.commenterName,
        body: comments.body,
        createdAt: comments.createdAt,
      });

    return Response.json({ comment: inserted }, { status: 201 });
  } catch (error) {
    console.error('POST COMMENT ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
