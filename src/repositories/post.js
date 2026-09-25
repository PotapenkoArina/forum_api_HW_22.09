let posts = [
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