import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { logError, logInfo, logDebug } from '@/utils/logger';

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
    logInfo(`Fetching author with ID: ${authorId}`);

    const { data: author, error } = await supabase
      .from('authors')
      .select('*')
      .eq('id', parseInt(authorId))
      .single();

    if (error) {
      logError('Supabase error occurred', error);
      throw error;
    }

    if (!author) {
      logError(`No author found with ID: ${authorId}`);
      throw new Error('Author not found');
    }

    isDev && logDebug('Successfully fetched author:', author);
    return NextResponse.json({ author });
  } catch (error) {
    logError('Error fetching author', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch author',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 