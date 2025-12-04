import { NextResponse } from 'next/server';
import { getPost } from '@/lib/notion';
import { formatDate, richTextToMarkdown } from '@/utils/notion';
import { NotionPost } from '@/types/notion';

export const revalidate = 60; // Revalidate every minute

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await Promise.resolve(context.params);

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const { post, blocks } = await getPost(slug);
    const typedPost = post as NotionPost;

    // Convert Notion blocks to markdown
    const content = blocks.map(block => {
      // Handle paragraphs
      if ('paragraph' in block && block.paragraph) {
        return richTextToMarkdown(block.paragraph.rich_text);
      }

      // Handle headings
      if ('heading_1' in block && block.heading_1) {
        return '# ' + richTextToMarkdown(block.heading_1.rich_text);
      }
      if ('heading_2' in block && block.heading_2) {
        return '## ' + richTextToMarkdown(block.heading_2.rich_text);
      }
      if ('heading_3' in block && block.heading_3) {
        return '### ' + richTextToMarkdown(block.heading_3.rich_text);
      }

      // Handle bulleted lists
      if ('bulleted_list_item' in block && block.bulleted_list_item) {
        return '- ' + richTextToMarkdown(block.bulleted_list_item.rich_text);
      }

      // Handle numbered lists
      if ('numbered_list_item' in block && block.numbered_list_item) {
        return '1. ' + richTextToMarkdown(block.numbered_list_item.rich_text);
      }

      // Handle code blocks
      if ('code' in block && block.code) {
        const code = richTextToMarkdown(block.code.rich_text);
        const language = block.code.language || '';
        return '```' + language + '\n' + code + '\n```';
      }

      // Handle quotes
      if ('quote' in block && block.quote) {
        return '> ' + richTextToMarkdown(block.quote.rich_text);
      }

      return '';
    }).filter(line => line.trim() !== '').join('\n\n');

    const formattedPost = {
      title: typedPost.properties.Title.title[0]?.plain_text ?? 'Untitled',
      date: typedPost.properties.Date.date?.start ?? '',
      content,
    };

    // Format the date
    formattedPost.date = formatDate(formattedPost.date);

    return NextResponse.json({ post: formattedPost });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch post',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
} 