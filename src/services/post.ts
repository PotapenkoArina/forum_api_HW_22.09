import * as postRepository from '../repositories/post.js';
import type { Post } from '../transport/dto/post/responses.js';

interface CreatePostData {
  title: string;
  content: string;
  author: string;
  category: string;
}

export const getPosts = (category?: string, take?: number): Post[] => {
  return postRepository.getAll(category, take);
};

export const getPostById = (id: number): Post | undefined => {
  return postRepository.getById(id);
};

export const createPost = async (data: CreatePostData): Promise<Post> => {
  const posts = postRepository.getAll();
  const newPost: Post = {
    id: posts.length + 1,
    title: data.title.trim(),
    content: data.content.trim(),
    author: data.author.trim(),
    category: data.category.trim(),
  };

  return await postRepository.addPost(newPost);
};