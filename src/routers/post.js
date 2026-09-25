import { Router } from 'express';
import { getPostById, getPosts, createPost } from '../handlers/post.js';

const router = Router();

// создаём обычные пути
router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', createPost);

export default router;