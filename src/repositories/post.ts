import type { Post } from '../domain/post/entity.js';
import type { NewPost, PostRepository } from '../domain/post/repository.js';

export function createPostRepository(): PostRepository {
  let posts: Post[] = [
    {
      id: 1,
      title: '12345',
      content: 'svsfv s',
      author: 'Arina',
      category: 'fruit',
    },
    {
      id: 2,
      title: '1234',
      content: 'sfdbfhnd',
      author: 'Arina',
      category: 'vegetables',
    },
    {
      id: 3,
      title: '123456',
      content: 'fggsrdfdf',
      author: 'Polina',
      category: 'fruit',
    },
    {
      id: 4,
      title: '1234568',
      content: 'fggsrdfdf',
      author: 'Poli',
      category: 'fruit',
    },
  ];

  return {
    async getAll(category, take) {
      let result = [...posts];

      if (category !== undefined) {
        result = result.filter((post) => post.category === category);
      }

      return take === undefined ? result : result.slice(0, take);
    },
    async getById(id) {
      return posts.find((post) => post.id === id);
    },
    async createPost(data: NewPost) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });

      const id = posts.reduce((highestId, post) => Math.max(highestId, post.id), 0) + 1;
      const post = { id, ...data };
      posts = [...posts, post];
      return post;
    },
  };
}