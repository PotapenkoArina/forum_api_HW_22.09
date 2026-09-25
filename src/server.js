import express from 'express';
import postRouter from './routers/post.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/posts', postRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;