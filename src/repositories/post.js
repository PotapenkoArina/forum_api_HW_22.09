let posts = [
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

export function getAll(category, take) {
  let result = [...posts];

  if (category) {
    result = result.filter(function (post) {
      return post.category === category;
    });
  }

  if (take) {
    return result.slice(0, take);
  }

  return result;
}

export function getById(id) {
  return posts.find(
    function (post) {
      return post.id === id;
    }
  );
}

export function addPost(post) {
  const newPost = { id: posts.length + 1, ...post };

  return new Promise((resolve) => {
    setTimeout(() => {
      posts = [...posts, newPost];
      resolve(newPost);
    }, 500);
  });
}