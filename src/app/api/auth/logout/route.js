import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return Response.json({ success: true }, { status: 200 });
}
