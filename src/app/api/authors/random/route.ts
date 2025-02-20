import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const isDev = process.env.NODE_ENV === 'development';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get('exclude');
    
    isDev && console.log('Fetching random author, excluding ID:', excludeId);

    let query = supabase
      .from('authors')
      .select('*')
      .limit(1);

    if (excludeId) {
      query = query.neq('id', parseInt(excludeId));
    }

    const { data: author, error } = await query.single();

    if (error) {
      console.error('Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    if (!author) {
      console.error('No author found');
      throw new Error('No author found');
    }

    isDev && console.log('Successfully fetched random author:', author);
    return NextResponse.json({ author });
  } catch (error) {
    console.error('Error fetching random author:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch random author',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 