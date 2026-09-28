import { Router } from 'express';
import { createPost, getPostById, getPosts } from '../handlers/post.js';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', createPost);

export default router;