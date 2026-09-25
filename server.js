import express from 'express';
import postRouter from './routers/post.js';

const app = express();
const PORT = 8000;
const HOST = 'localhost';

// встроенный middleware, который позволяет распарсить JSON в JavaScript-объект
app.use(express.json());
// подключаем роутер для постов
app.use('/posts', postRouter);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});