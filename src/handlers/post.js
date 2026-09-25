import * as postService from '../services/post.js';

const parseListQuery = (req, res) => {
  const { category, take } = req.query;

  if (take !== undefined && (!/^\d+$/.test(take) || Number(take) < 1)) {
    res.status(422).json({ message: 'take must be a positive integer' });
    return null;
  }

  return { category, take: take === undefined ? undefined : Number(take) };
};

const getPosts = (req, res) => {
  const query = parseListQuery(req, res);
  if (!query) return;

  res.status(200).json(postService.getPosts(query.category, query.take));
};

const getPostById = (req, res) => {
  if (!/^\d+$/.test(req.params.id)) {
    res.status(422).json({ message: 'id must be a positive integer' });
    return;
  }

  const post = postService.getPostById(Number(req.params.id));
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }

  res.status(200).json(post);
};

const createPost = async (req, res) => {
  const { title, content, author, category } = req.body ?? {};

  if (
    typeof title !== 'string' ||
    !title.trim() ||
    typeof content !== 'string' ||
    !content.trim() ||
    typeof author !== 'string' ||
    !author.trim() ||
    typeof category !== 'string' ||
    !category.trim()
  ) {
    res.status(422).json({ message: 'title, content, author and category are required' });
    return;
  }

  const post = await postService.createPost({
    title: title.trim(),
    content: content.trim(),
    author: author.trim(),
    category: category.trim(),
  });

  res.status(201).json(post);
};

export { getPosts, getPostById, createPost };