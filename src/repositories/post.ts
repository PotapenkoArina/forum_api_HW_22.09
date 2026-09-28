import type { Post } from '../transport/dto/post/responses.js';

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

export const getAll = (category?: string, take?: number): Post[] => {
  let result = [...posts];

  if (category) {
    result = result.filter((post) => post.category === category);
  }

  return take ? result.slice(0, take) : result;
};

export const getById = (id: number): Post | undefined => {
  return posts.find((post) => post.id === id);
};

export const addPost = (post: Post): Promise<Post> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      posts = [...posts, post];
      resolve(post);
    }, 500);
  });
};