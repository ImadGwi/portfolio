import { db } from '@/lib/db';
import { users } from '@/db/schema';

export async function GET() {
  try {
    const [user] = await db
      .select({ bio: users.bio })
      .from(users)
      .limit(1);

    return Response.json({ bio: user?.bio || '' });
  } catch (error) {
    console.error('GET /api/bio error:', error);
    return Response.json({ bio: '' });
  }
}
