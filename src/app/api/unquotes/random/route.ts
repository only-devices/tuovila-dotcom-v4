import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

interface Quote {
  id: number;
  unquote: string;
  author_id: number;
  source: string;
  created_at: string;
  quote_date: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const isDev = process.env.NODE_ENV === 'development';

export async function GET() {
  try {
    isDev && console.log('Attempting to fetch random quote...');
    
    const { data, error } = await supabase
      .rpc('get_random_unquote');

    isDev && console.log('Raw RPC response:', data);

    if (error) {
      isDev && console.error('Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    if (!data) {
      isDev && console.error('No quote returned from database');
      throw new Error('No quote found');
    }

    // Check if data is an array (some RPCs return arrays)
    const quote = Array.isArray(data) ? data[0] : data as Quote;

    if (!quote || !quote.unquote || !quote.author_id || !quote.source) {
      isDev && console.error('Invalid quote data structure:', quote);
      throw new Error('Invalid quote data structure');
    }

    isDev && console.log('Successfully fetched quote:', {
      id: quote.id,
      content: quote.unquote,
      author_id: quote.author_id,
      source: quote.source
    });
    
    // Transform the quote to match the frontend expected structure
    return NextResponse.json({ 
      quote: {
        id: quote.id,
        content: quote.unquote,
        author_id: quote.author_id,
        source: quote.source
      }
    });
  } catch (error) {
    isDev && console.error('Error fetching random quote:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch random quote',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 