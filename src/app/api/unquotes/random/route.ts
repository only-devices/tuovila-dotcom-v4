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

export async function GET() {
  try {
    
    const { data, error } = await supabase
      .rpc('get_random_unquote');

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No quote found');
    }

    // Check if data is an array (some RPCs return arrays)
    const quote = Array.isArray(data) ? data[0] : data as Quote;

    if (!quote || !quote.unquote || !quote.author_id || !quote.source) {
      throw new Error('Invalid quote data structure');
    }
    
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
    return NextResponse.json(
      { 
        error: 'Failed to fetch random quote',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 