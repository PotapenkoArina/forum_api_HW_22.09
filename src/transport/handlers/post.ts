import type { RequestHandler } from 'express';
import type { PostService } from '../../services/post/post.types.js';
import type { CreatePost, PostParams, PostQuery } from '../dto/post/requests.js';
import type { Error } from '../dto/post/errors.js';
import type { Post } from '../dto/post/responses.js';

export function createPostHandlers(postService: PostService) {
  const getPosts: RequestHandler<
    Record<string, string>,
    Post[] | Error,
    unknown,
    PostQuery
  > = async (req, res) => {
    const { category, take } = req.query;

    if (category !== undefined && typeof category !== 'string') {
      return res.status(400).json({ message: 'Category must be a string' });
    }

    if (take === undefined) {
      return res.status(200).json(await postService.getPosts(category));
    }

    if (typeof take !== 'string') {
      return res.status(400).json({ message: 'Take must be a positive integer' });
    }

    const takeNumber = Number(take);
    if (!Number.isInteger(takeNumber) || takeNumber <= 0) {
      return res.status(400).json({ message: 'Take must be a positive integer' });
    }

    return res.status(200).json(await postService.getPosts(category, takeNumber));
  };

  const getPostById: RequestHandler<PostParams, Post | Error> = async (req, res) => {
    const postId = Number(req.params.id);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ message: 'Id must be a positive integer' });
    }

    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(post);
  };

  const createPost: RequestHandler<
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
      const post = await postService.createPost({ title, content, author, category });
      return res.status(201).json(post);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to create post' });
    }
  };

  return { getPosts, getPostById, createPost };
}