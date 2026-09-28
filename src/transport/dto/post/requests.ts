import type { ParsedQs } from 'qs';

export type CreatePost = {
  title: string;
  content: string;
  author: string;
  category: string;
};

export interface PostQuery extends ParsedQs {
  category?: string;
  take?: string;
}

export type PostParams = Record<'id', string>;