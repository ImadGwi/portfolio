import { db } from '@/lib/db';
import { comments, projects } from '@/db/schema';
import { and, desc, eq, inArray, isNotNull, isNull } from 'drizzle-orm';
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

function getScopeCondition(scope) {
  if (scope === 'project') return isNotNull(comments.projectId);
  if (scope === 'general') return isNull(comments.projectId);
  return null;
}

function combineAndConditions(conditions) {
  const filtered = conditions.filter(Boolean);
  if (filtered.length === 0) return undefined;
  if (filtered.length === 1) return filtered[0];
  return and(...filtered);
}

export async function GET(request) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get('countOnly') === 'true';
    const scope = searchParams.get('scope');
    const scopeCondition = getScopeCondition(scope);

    const unreadWhere = combineAndConditions([
      eq(comments.isAdminReply, false),
      isNull(comments.parentId),
      eq(comments.isRead, false),
      scopeCondition,
    ]);

    if (countOnly) {
      const unreadRows = await db.select({ id: comments.id }).from(comments).where(unreadWhere);
      return Response.json({ unreadCount: unreadRows.length }, { status: 200 });
    }

    const rootsWhere = combineAndConditions([
      eq(comments.isAdminReply, false),
      isNull(comments.parentId),
      scopeCondition,
    ]);

    const rootComments = await db
      .select({
        id: comments.id,
        projectId: comments.projectId,
        commenterName: comments.commenterName,
        body: comments.body,
        isRead: comments.isRead,
        isHidden: comments.isHidden,
        isPriority: comments.isPriority,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
      })
      .from(comments)
      .where(rootsWhere)
      .orderBy(desc(comments.isPriority), desc(comments.createdAt));

    const unreadCount = rootComments.filter((comment) => !comment.isRead).length;

    if (rootComments.length === 0) {
      return Response.json({ comments: [], unreadCount }, { status: 200 });
    }

    const rootIds = rootComments.map((comment) => comment.id);
    const projectIds = [...new Set(rootComments.map((comment) => comment.projectId).filter(Boolean))];

    const [replyRows, projectRows] = await Promise.all([
      db
        .select({
          id: comments.id,
          parentId: comments.parentId,
          commenterName: comments.commenterName,
          body: comments.body,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt,
        })
        .from(comments)
        .where(and(eq(comments.isAdminReply, true), inArray(comments.parentId, rootIds))),
      projectIds.length > 0
        ? db
            .select({ id: projects.id, title: projects.title })
            .from(projects)
            .where(inArray(projects.id, projectIds))
        : Promise.resolve([]),
    ]);

    const repliesByParentId = new Map(replyRows.map((reply) => [reply.parentId, reply]));
    const projectTitleById = new Map(projectRows.map((project) => [project.id, project.title]));

    const data = rootComments.map((comment) => ({
      ...comment,
      projectTitle: comment.projectId ? projectTitleById.get(comment.projectId) || null : null,
      reply: repliesByParentId.get(comment.id) || null,
    }));

    return Response.json({ comments: data, unreadCount }, { status: 200 });
  } catch (error) {
    console.error('GET ADMIN COMMENTS ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
