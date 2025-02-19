import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/notion';
import { PageObjectResponse, BlockObjectResponse, ParagraphBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export const revalidate = 60; // Revalidate every minute

interface NotionProperties {
  Title: {
    id: string;
    type: 'title';
    title: Array<{
      type: 'text';
      text: {
        content: string;
        link: null;
      };
      annotations: {
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
        underline: boolean;
        code: boolean;
        color: string;
      };
      plain_text: string;
      href: null;
    }>;
  };
  Date: {
    id: string;
    type: 'date';
    date: {
      start: string;
      end: null;
      time_zone: null;
    } | null;
  };
  Slug: {
    id: string;
    type: 'rich_text';
    rich_text: Array<{
      type: 'text';
      text: {
        content: string;
        link: null;
      };
      annotations: {
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
        underline: boolean;
        code: boolean;
        color: string;
      };
      plain_text: string;
      href: null;
    }>;
  };
  Published: {
    id: string;
    type: 'checkbox';
    checkbox: boolean;
  };
}

function isValidPost(post: unknown): post is PageObjectResponse & { properties: NotionProperties } {
  if (!post || typeof post !== 'object' || !('properties' in post)) {
    console.log('Invalid post object structure');
    return false;
  }

  const props = post.properties as Record<string, unknown>;
  
  // Check Title
  if (!props.Title || typeof props.Title !== 'object' || !('type' in props.Title) || props.Title.type !== 'title') {
    console.log('Invalid Title property');
    return false;
  }

  // Check Date
  if (!props.Date || typeof props.Date !== 'object' || !('type' in props.Date) || props.Date.type !== 'date') {
    console.log('Invalid Date property');
    return false;
  }

  // Check Slug
  if (!props.Slug || typeof props.Slug !== 'object' || !('type' in props.Slug) || props.Slug.type !== 'rich_text') {
    console.log('Invalid Slug property');
    return false;
  }

  // Check Published
  if (!props.Published || typeof props.Published !== 'object' || !('type' in props.Published) || props.Published.type !== 'checkbox') {
    console.log('Invalid Published property');
    return false;
  }

  const typedPost = post as PageObjectResponse & { properties: NotionProperties };

  // Check if required content exists
  const hasTitle = typedPost.properties.Title.title.length > 0;
  const hasDate = typedPost.properties.Date.date !== null;
  const hasSlug = typedPost.properties.Slug.rich_text.length > 0;
  const isPublished = typedPost.properties.Published.checkbox;

  if (!hasTitle) console.log('Missing title content');
  if (!hasDate) console.log('Missing date content');
  if (!hasSlug) console.log('Missing slug content');
  if (!isPublished) console.log('Post is not published');

  return hasTitle && hasDate && hasSlug && isPublished;
}

function isParagraphBlock(block: BlockObjectResponse): block is ParagraphBlockObjectResponse {
  return block.type === 'paragraph';
}

function getExcerptFromBlocks(blocks: BlockObjectResponse[]) {
  // Find the first paragraph block
  const firstParagraph = blocks.find(isParagraphBlock);
  if (!firstParagraph) return 'Click to read more...';

  // Get the text content from the paragraph
  const text = firstParagraph.paragraph.rich_text
    .map(richText => richText.plain_text)
    .join('');

  // Limit to roughly 2 sentences or 200 characters
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const excerpt = sentences.slice(0, 2).join(' ');
  return excerpt.length > 200 ? excerpt.slice(0, 197) + '...' : excerpt;
}

export async function GET() {
  try {
    const postsWithBlocks = await getAllPosts();
    console.log('Raw posts:', JSON.stringify(postsWithBlocks, null, 2));
    
    const formattedPosts = postsWithBlocks
      .map(({ post, blocks }) => {
        console.log('Checking post:', post.id);
        
        if (!isValidPost(post)) {
          console.log('Post validation failed for:', post.id);
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
        date: new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }));

    if (formattedPosts.length === 0) {
      console.warn('No valid posts found in Notion response');
    } else {
      console.log('Formatted posts:', formattedPosts);
    }

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch posts',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
} 