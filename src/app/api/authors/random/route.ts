import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get('exclude');
    

    let query = supabase
      .from('authors')
      .select('*')
      .limit(1);

    if (excludeId) {
      query = query.neq('id', parseInt(excludeId));
    }

    const { data: author, error } = await query.single();

    if (error) {
      throw error;
    }

    if (!author) {
      throw new Error('No author found');
    }

    return NextResponse.json({ author });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to fetch random author',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 