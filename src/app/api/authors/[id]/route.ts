import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
      throw error;
    }

    if (!author) {
      throw new Error('Author not found');
    }

    return NextResponse.json({ author });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to fetch author',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 