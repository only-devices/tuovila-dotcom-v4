import { BlockObjectResponse, ParagraphBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionPost } from '@/types/notion';

export function isParagraphBlock(block: BlockObjectResponse): block is ParagraphBlockObjectResponse {
  return block.type === 'paragraph';
}

export function getExcerptFromBlocks(blocks: BlockObjectResponse[]) {
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

export function isValidPost(post: unknown): post is NotionPost {
  if (!post || typeof post !== 'object' || !('properties' in post)) {
    return false;
  }

  const props = post.properties as Record<string, unknown>;
  
  // Check Title
  if (!props.Title || typeof props.Title !== 'object' || !('type' in props.Title) || props.Title.type !== 'title') {
    return false;
  }

  // Check Date
  if (!props.Date || typeof props.Date !== 'object' || !('type' in props.Date) || props.Date.type !== 'date') {
    return false;
  }

  // Check Slug
  if (!props.Slug || typeof props.Slug !== 'object' || !('type' in props.Slug) || props.Slug.type !== 'rich_text') {
    return false;
  }

  // Check Published
  if (!props.Published || typeof props.Published !== 'object' || !('type' in props.Published) || props.Published.type !== 'checkbox') {
    return false;
  }

  const typedPost = post as NotionPost;

  // Check if required content exists
  const hasTitle = typedPost.properties.Title.title.length > 0;
  const hasDate = typedPost.properties.Date.date !== null;
  const hasSlug = typedPost.properties.Slug.rich_text.length > 0;
  const isPublished = typedPost.properties.Published.checkbox;

  const isValid = hasTitle && hasDate && hasSlug && isPublished;
  if (!isValid) {
  }

  return isValid;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 