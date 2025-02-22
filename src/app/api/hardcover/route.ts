import { NextResponse } from 'next/server';
import { logError, logInfo } from '@/utils/logger';

interface Author {
  name: string;
  slug: string;
}

interface Contribution {
  author: Author;
}

interface BookData {
  contributions: Contribution[];
  image: {
    url: string;
  };
  images: {
    url: string;
  }[];
  slug: string;
  title: string;
}

interface UserBook {
  rating: number;
  book: BookData;
}

interface HardcoverResponse {
  data: {
    me: [
      {
        user_books: UserBook[];
      }
    ];
  };
}

const isDev = process.env.NODE_ENV === 'development';

export async function GET() {
  const HARDCOVER_API_KEY = process.env.HARDCOVER_API_KEY;

  if (!HARDCOVER_API_KEY) {
    return NextResponse.json({ error: 'Hardcover API key not configured' }, { status: 500 });
  }

  try {
    isDev && console.log('Fetching books from Hardcover...');
    const response = await fetch(
      'https://api.hardcover.app/v1/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': HARDCOVER_API_KEY
        },
        body: JSON.stringify({
          query: `{
            me {
              user_books(
                where: {status_id: {_eq: 3}, last_read_date: {_is_null: false}}
                order_by: {last_read_date: desc}
                limit: 12
              ) {
                rating
                book {
                  contributions {
                    author {
                      name
                      slug
                    }
                  }
                  image {
                    url
                  }
                  slug
                  title
                  images {
                    url
                  }
                }
              }
            }
          }`
        }),
        cache: 'no-store'
      }
    );

    const responseText = await response.text();
    isDev && console.log('Raw API Response:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to fetch books from Hardcover: ${responseText}`);
    }

    const data = JSON.parse(responseText) as HardcoverResponse;
    isDev && console.log('Parsed API Response:', JSON.stringify(data, null, 2));
    
    if (!data.data?.me?.[0]?.user_books) {
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response format from Hardcover API');
    }

    const books = data.data.me[0].user_books.map((userBook) => ({
      title: userBook.book.title,
      author: userBook.book.contributions[0]?.author.name || 'Unknown Author',
      coverUrl: userBook.book.image?.url || userBook.book.images?.[0]?.url || '/images/book-placeholder.png',
      hardcoverUrl: `https://hardcover.app/books/${userBook.book.slug}`,
      rating: userBook.rating
    }));

    return NextResponse.json({ books });
  } catch (error) {
    await logError('Error fetching Hardcover data', { 
      error: error instanceof Error ? error.message : 'Failed to fetch books',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch books',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
} 