import express from 'express'
import { createPostRouter } from './transport/routers/post.js'
import { createPostHandler } from './transport/handlers/post.js';
import { createPostRepository } from './repositories/post.js';
import { createPostService } from './services/post.js';
import { createCategoryRouter } from './transport/routers/category.js'
import { createCategoryHandler } from './transport/handlers/category.js'
import { createCategoryRepository } from './repositories/category.js'
import { createCategoryService } from './services/category.js'
import { db } from './prisma/db.js';
//const express = require('express');

const app = express();
const categoryRepository = createCategoryRepository(db)
const categoryService = createCategoryService(categoryRepository)
const categoryHandlers = createCategoryHandler(categoryService)
const categoryRouter = createCategoryRouter(categoryHandlers)
const postRepository = createPostRepository(db)
const postService = createPostService(postRepository, categoryRepository)
const postHandlers = createPostHandler(postService)
const postRouter = createPostRouter(postHandlers)
// app.use(express.json()) - встроенный middleware, который позволяет спарсить json обьект в js обьект
app.use(express.json())
app.use('/posts', postRouter)
app.use('/categories', categoryRouter)
// products    ->  router.get('/', getProducts)
// products/1  ->  router.get('/:id', getProductById)

const PORT = 8000
const HOST = 'localhost'; 



app.listen(PORT, HOST, ()=>{
    console.log(`Сервер запущен на http://${HOST}:${PORT}`)
})