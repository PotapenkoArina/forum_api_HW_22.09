import type { Post } from '../../domain/post/entity.js';
import type { NewPost } from '../../domain/post/repository.js';

export type CreatePostInput = NewPost;

export interface PostService {
  getPosts(category?: string, take?: number): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  createPost(input: CreatePostInput): Promise<Post>;
}