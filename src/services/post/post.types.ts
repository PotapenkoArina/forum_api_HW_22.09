import type { Post } from "../../domain/post/entity.js"

export interface CreatePostInput {
    name: string
    content: string
    author: string
    category: string
}

export interface PostService {
    getPosts(category?: string, take?: number): Promise<Post[]>
    getPostById(id: number): Promise<Post | undefined>
    createPost(input: CreatePostInput): Promise<Post | null>
}