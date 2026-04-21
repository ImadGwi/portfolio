import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { signToken, verifyPassword } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

export async function POST(request) {

  try {
    const body = await request.json();
    const { username, password, urlPass } = body;

    // ── Basic validation ───────────────────────────────────────────────────
    if (!username || !password || !urlPass) {
      return Response.json(
        { error: 'Username, password, and access key are required.' },
        { status: 400 }
      );
    }

    // ── Fetch user from DB ─────────────────────────────────────────────────
    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);

    if (!user) {
      return Response.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // ── Verify URL access pass ─────────────────────────────────────────────
    const isUrlPassValid = await verifyPassword(urlPass, user.urlAccessPass);
    if (!isUrlPassValid) {
      return Response.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // ── Verify password ────────────────────────────────────────────────────
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return Response.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // ── Issue JWT session token ────────────────────────────────────────────
    const token = await signToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    // ── Set secure HTTP-only cookie ────────────────────────────────────────
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });

    return Response.json(
      { success: true, redirect: '/admin' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[LOGIN_ERROR]', error);
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
