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
import { createUserRepository } from './repositories/user.js'
import { createAuthService } from './services/auth/auth.js'
import { hashPassword, verifyPassword } from './lib/password.js'
import { signAccessToken } from './lib/jwt.js'
import { createAuthHandler } from './transport/handlers/auth.js'
import { createAuthRouter } from './transport/routers/auth.js'
//const express = require('express');

const app = express();
const categoryRepository = createCategoryRepository(db)
const categoryService = createCategoryService(categoryRepository)
const categoryHandlers = createCategoryHandler(categoryService)
const categoryRouter = createCategoryRouter(categoryHandlers)
const postRepository = createPostRepository(db)
const userRepository = createUserRepository(db)
const postService = createPostService(postRepository, categoryRepository, userRepository)
const postHandlers = createPostHandler(postService)
const postRouter = createPostRouter(postHandlers)
const authService = createAuthService(
    userRepository,
    { hash: hashPassword, verify: verifyPassword },
    { signAccessToken }
)
const authHandlers = createAuthHandler(authService)
const authRouter = createAuthRouter(authHandlers)
// app.use(express.json()) - встроенный middleware, который позволяет спарсить json обьект в js обьект
app.use(express.json())
app.use('/posts', postRouter)
app.use('/categories', categoryRouter)
app.use('/auth', authRouter)
// products    ->  router.get('/', getProducts)
// products/1  ->  router.get('/:id', getProductById)

const PORT = 8000
const HOST = 'localhost'; 



app.listen(PORT, HOST, ()=>{
    console.log(`Сервер запущен на http://${HOST}:${PORT}`)
})