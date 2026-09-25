import { Router } from 'express';
import * as postHandler from '../handlers/post.js';

const postRouter = Router();

postRouter.get('/', postHandler.getPosts);
postRouter.get('/:id', postHandler.getPostById);
postRouter.post('/', postHandler.createPost);

export default postRouter;