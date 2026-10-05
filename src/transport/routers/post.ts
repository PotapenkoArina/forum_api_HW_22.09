import type { PostHandlers } from "../handlers/post.js";

import { Router } from "express";
export function createPostRouter(handlers: PostHandlers){
    const router = Router()
    router.get('/', handlers.getPosts)
    router.get('/:id', handlers.getPostById)
    router.post('/', handlers.createPost)

    return router
}