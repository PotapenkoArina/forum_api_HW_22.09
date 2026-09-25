const posts = [
  {
    id: 1,
    title: 'Understanding JavaScript closures',
    content: 'Closures let a function remember variables from its outer scope.',
    author: 'Ada Lovelace',
    category: 'programming',
  },
  {
    id: 2,
    title: 'A quiet morning walk',
    content: 'Small routines can make an ordinary day feel more intentional.',
    author: 'Grace Hopper',
    category: 'lifestyle',
  },
  {
    id: 3,
    title: 'Building reliable APIs',
    content: 'Clear contracts and focused layers make APIs easier to evolve.',
    author: 'Alan Turing',
    category: 'programming',
  },
];

const getAll = (category, take) => {
  const filteredPosts = category
    ? posts.filter((post) => post.category === category)
    : posts;

  return typeof take === 'number' ? filteredPosts.slice(0, take) : [...filteredPosts];
};

const getById = (id) => posts.find((post) => post.id === id);

const addPost = (post) => {
  const newPost = { id: posts.length ? posts[posts.length - 1].id + 1 : 1, ...post };
  posts.push(newPost);
  return Promise.resolve(newPost);
};

export { getAll, getById, addPost };