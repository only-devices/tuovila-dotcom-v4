import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { logError, logInfo, logDebug } from '@/utils/logger';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get('exclude');
    
    logInfo(`Fetching random author${excludeId ? `, excluding ID: ${excludeId}` : ''}`);

    let query = supabase
      .from('authors')
      .select('*')
      .limit(1);

    if (excludeId) {
      query = query.neq('id', parseInt(excludeId));
    }

    const { data: author, error } = await query.single();

    if (error) {
      logError('Supabase error occurred', error);
      throw error;
    }

    if (!author) {
      logError('No author found');
      throw new Error('No author found');
    }

    logDebug('Successfully fetched random author:', author);
    return NextResponse.json({ author });
  } catch (error) {
    logError('Error fetching random author', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch random author',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 