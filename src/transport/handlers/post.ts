import type { RequestHandler } from 'express';
import * as postService from '../../services/post.js';
import type { CreatePost, PostParams, PostQuery } from '../dto/post/requests.js';
import type { Error } from '../dto/post/errors.js';
import type { Post } from '../dto/post/responses.js';

export const getPosts: RequestHandler<
  Record<string, string>,
  Post[] | Error,
  unknown,
  PostQuery
> = (req, res) => {
  const { category, take } = req.query;

  if (category !== undefined && typeof category !== 'string') {
    return res.status(400).json({ message: 'Category must be a string' });
  }

  if (take === undefined) {
    return res.status(200).json(postService.getPosts(category));
  }

  if (typeof take !== 'string') {
    return res.status(400).json({ message: 'Take must be a positive integer' });
  }

  const takeNumber = Number(take);
  if (!Number.isInteger(takeNumber) || takeNumber <= 0) {
    return res.status(400).json({ message: 'Take must be a positive integer' });
  }

  return res.status(200).json(postService.getPosts(category, takeNumber));
};

export const getPostById: RequestHandler<
  PostParams,
  Post | Error
> = (req, res) => {
  const postId = Number(req.params.id);
  if (!Number.isInteger(postId) || postId <= 0) {
    return res.status(400).json({ message: 'Id must be a positive integer' });
  }

  const post = postService.getPostById(postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  return res.status(200).json(post);
};

export const createPost: RequestHandler<
  Record<string, string>,
  Post | Error,
  CreatePost
> = async (req, res) => {
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
};