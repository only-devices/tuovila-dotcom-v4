import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const isDev = process.env.NODE_ENV === 'development';
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: authorId } = await context.params;

    const { data: author, error } = await supabase
      .from('authors')
      .select('*')
      .eq('id', parseInt(authorId))
      .single();

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
      console.error('No author found with ID:', authorId);
      throw new Error('Author not found');
    }

    isDev && console.log('Successfully fetched author:', author);
    return NextResponse.json({ author });
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch author',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 