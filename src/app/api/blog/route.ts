import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/notion';
import { isValidPost, getExcerptFromBlocks, formatDate } from '@/utils/notion';
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { logError, logInfo } from '@/utils/logger';

export const revalidate = 60; // Revalidate every minute

export async function GET() {
  try {
    const postsWithBlocks = await getAllPosts();
    
    const formattedPosts = postsWithBlocks
      .map(({ post, blocks }) => {
        if (!isValidPost(post)) {
          return null;
        }
        
        return {
          title: post.properties.Title.title[0].plain_text,
          excerpt: getExcerptFromBlocks(blocks as BlockObjectResponse[]),
          date: post.properties.Date.date!.start,
          slug: post.properties.Slug.rich_text[0].plain_text,
        };
      })
      .filter((post): post is NonNullable<typeof post> => post !== null)
      .map(post => ({
        ...post,
        date: formatDate(post.date)
      }));

    if (formattedPosts.length === 0) {
      logInfo('No valid posts found in Notion response');
    }

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    logError('Error fetching blog posts:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch posts',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
} 