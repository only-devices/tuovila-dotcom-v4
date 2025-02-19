import { Client } from '@notionhq/client';

if (!process.env.NOTION_TOKEN) {
  throw new Error('NOTION_TOKEN is not set');
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error('NOTION_DATABASE_ID is not set');
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2022-06-28'
});

export async function getAllPosts() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: 'Published',
      checkbox: {
        equals: true
      }
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending'
      }
    ]
  });

  // Fetch blocks for each post
  const postsWithBlocks = await Promise.all(
    response.results.map(async (post) => {
      const blocks = await notion.blocks.children.list({
        block_id: post.id
      });
      return {
        post,
        blocks: blocks.results
      };
    })
  );

  return postsWithBlocks;
}

export async function getPost(slug: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: 'Slug',
          rich_text: {
            equals: slug
          }
        },
        {
          property: 'Published',
          checkbox: {
            equals: true
          }
        }
      ]
    }
  });

  const post = response.results[0];
  if (!post) {
    throw new Error(`No post found with slug: ${slug}`);
  }

  const blocks = await notion.blocks.children.list({
    block_id: post.id
  });

  return {
    post,
    blocks: blocks.results
  };
}