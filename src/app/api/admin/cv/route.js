import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import ImageKit from 'imagekit';

const SESSION_COOKIE = 'admin_session';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'superAdmin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [user] = await db.select({ cvFilePath: users.cvFilePath }).from(users).where(eq(users.id, payload.id)).limit(1);

    if (!user || !user.cvFilePath) {
      return Response.json({ cvUrl: null }, { status: 200 });
    }

    // Generate signed URL using ImageKit SDK
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });

    const signedUrl = imagekit.url({
      path: user.cvFilePath,
      signed: true,
      expireSeconds: 900 // 15 minutes validity
    });

    return Response.json({ cvUrl: signedUrl }, { status: 200 });
  } catch (error) {
    console.error('GET CV ERROR:', error);
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
    const { cvFilePath } = body;

    if (!cvFilePath) {
      return Response.json({ error: 'CV file path is required' }, { status: 400 });
    }

    // Since we only have one admin user in this setup, we update based on session ID
    await db.update(users)
      .set({ cvFilePath, updatedAt: new Date() })
      .where(eq(users.id, payload.id));

    return Response.json({ success: true, cvFilePath }, { status: 200 });
  } catch (error) {
    console.error('[CV_UPDATE_ERROR]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
