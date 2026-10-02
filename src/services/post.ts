import type { PostRepository } from '../domain/post/repository.js';
import type { CreatePostInput, PostService } from './post/post.types.js';

export function createPostService(repository: PostRepository): PostService {
  return {
    getPosts(category, take) {
      return repository.getAll(category, take);
    },
    getPostById(id) {
      return repository.getById(id);
    },
    createPost(input: CreatePostInput) {
      return repository.createPost({
        title: input.title.trim(),
        content: input.content.trim(),
        author: input.author.trim(),
        category: input.category.trim(),
      });
    },
  };
}