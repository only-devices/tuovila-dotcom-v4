import { NextRequest, NextResponse } from 'next/server';
import { getPost } from '@/lib/notion';
import { formatDate } from '@/utils/notion';
import { NotionPost } from '@/types/notion';

export const revalidate = 60; // Revalidate every minute

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const slug = context.params.slug;
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const { post, blocks } = await getPost(slug);
    const typedPost = post as NotionPost;
    
    // Convert Notion blocks to markdown
    const content = blocks.map(block => {
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

    // Format the date
    formattedPost.date = formatDate(formattedPost.date);

    return NextResponse.json({ post: formattedPost });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch post',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
} 