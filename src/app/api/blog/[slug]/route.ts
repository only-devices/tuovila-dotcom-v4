import { NextResponse } from 'next/server';
import { getPost } from '@/lib/notion';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export const revalidate = 60; // Revalidate every minute

interface NotionProperties {
  Title: {
    title: Array<{
      plain_text: string;
    }>;
  };
  Date: {
    date: {
      start: string;
    };
  };
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('Fetching post with slug:', params.slug);
    const { post, blocks } = await getPost(params.slug);
    console.log('Raw post data:', JSON.stringify(post, null, 2));

    const typedPost = post as PageObjectResponse & { properties: NotionProperties };
    
    // Convert Notion blocks to markdown
    const content = blocks.map(block => {
      // For now, just return text content
      if ('paragraph' in block) {
        return block.paragraph.rich_text.map(text => text.plain_text).join('');
      }
      return '';
    }).join('\n\n');
    
    const formattedPost = {
      title: typedPost.properties.Title.title[0]?.plain_text ?? 'Untitled',
      date: typedPost.properties.Date.date?.start ?? '',
      content,
    };

    console.log('Formatted post:', formattedPost);

    // Format the date
    formattedPost.date = new Date(formattedPost.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    console.log('Final formatted post:', formattedPost);
    return NextResponse.json({ post: formattedPost });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch post',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
} 