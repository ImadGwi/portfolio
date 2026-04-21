import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import sanitizeHtml from 'sanitize-html';

const SESSION_COOKIE = 'admin_session';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'superAdmin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [user] = await db.select({ bio: users.bio }).from(users).where(eq(users.id, payload.id)).limit(1);

    return Response.json({ bio: user?.bio || '' }, { status: 200 });
  } catch (error) {
    console.error('GET BIO ERROR:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'superAdmin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bioHtml } = body;

    if (bioHtml === undefined) {
      return Response.json({ error: 'Bio content is required' }, { status: 400 });
    }

    //### SECURITY: Sanitizing HTML to protect against XSS and malicious injections
    const sanitizedBio = sanitizeHtml(bioHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        '*': ['class', 'style'],
        'img': ['src', 'alt', 'width', 'height', 'loading'],
        'a': ['href', 'name', 'target', 'rel']
      },
      allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    });

    // Save the sanitized HTML to the database
    await db.update(users)
      .set({ bio: sanitizedBio, updatedAt: new Date() })
      .where(eq(users.id, payload.id));

    return Response.json({ success: true, bio: sanitizedBio }, { status: 200 });
  } catch (error) {
    console.error('[BIO_UPDATE_ERROR]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
