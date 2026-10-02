import express from 'express';
import { createPostRepository } from './repositories/post.js';
import { createPostService } from './services/post.js';
import { createPostRouter } from './transport/routers/post.js';

const app = express();
const PORT = 8000;
const HOST = 'localhost';
const postRepository = createPostRepository();
const postService = createPostService(postRepository);

app.use(express.json());
app.use('/posts', createPostRouter(postService));

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});