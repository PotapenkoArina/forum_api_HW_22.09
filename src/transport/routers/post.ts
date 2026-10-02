import { Router } from 'express';
import type { PostService } from '../../services/post/post.types.js';
import { createPostHandlers } from '../handlers/post.js';

export function createPostRouter(postService: PostService) {
	const router = Router();
	const { createPost, getPostById, getPosts } = createPostHandlers(postService);

	router.get('/', getPosts);
	router.get('/:id', getPostById);
	router.post('/', createPost);

	return router;
}