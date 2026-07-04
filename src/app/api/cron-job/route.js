import { db } from '@/lib/db';
import { projects } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Attempt to query at least one element from the projects table
    const result = await db.select({ id: projects.id }).from(projects).limit(1);
    
    const hasData = result.length > 0;

    return Response.json(
      { 
        success: true, 
        found: hasData 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('[CRON_JOB_ERROR]', error);
    
    // As per requirement: Always return 200 even on error, but indicate no data found/failure
    return Response.json(
      { 
        success: true, 
        found: false,
        error: "Database connection or query failed"
      }, 
      { status: 200 }
    );
  }
}
