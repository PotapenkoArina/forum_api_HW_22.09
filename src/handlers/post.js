import * as postService from '../services/post.js';

export function getPosts(req, res) {
  // получаем и проверяем query-параметры
  const { category, take } = req.query;

  if (!take) {
    return res.status(200).json(postService.getPosts(category));
  }

  const takeNumber = Number(take);
  if (!Number.isInteger(takeNumber) || takeNumber <= 0) {
    return res.status(400).json({ message: 'Take must be a positive integer' });
  }

  res.status(200).json(postService.getPosts(category, takeNumber));
}

export function getPostById(req, res) {
  // преобразуем id из строки в число
  const postId = Number(req.params.id);
  if (!Number.isInteger(postId) || postId <= 0) {
    return res.status(400).json({ message: 'Id must be a positive integer' });
  }

  const post = postService.getPostById(postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.status(200).json(post);
}

export async function createPost(req, res) {
  // проверяем данные нового поста
  const { title, content, author, category } = req.body ?? {};

  if (
    typeof title !== 'string' || !title.trim() ||
    typeof content !== 'string' || !content.trim() ||
    typeof author !== 'string' || !author.trim() ||
    typeof category !== 'string' || !category.trim()
  ) {
    return res.status(422).json({ message: 'Invalid post' });
  }

  try {
    const post = await postService.createPost({
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      category: category.trim(),
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create post' });
  }
}