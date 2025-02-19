import { PageObjectResponse, BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export interface NotionProperties {
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
  [key: string]: {
    id: string;
    type: string;
    [key: string]: string | number | boolean | null | Array<unknown> | Record<string, unknown>;
  };
}

export type NotionPost = Omit<PageObjectResponse, 'properties'> & {
  properties: NotionProperties;
};

export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}

export interface BlogPostDetail {
  title: string;
  date: string;
  content: string;
}

export interface NotionPostWithBlocks {
  post: NotionPost;
  blocks: BlockObjectResponse[];
} 