import type { Post, PostWithCategory } from "../../domain/post/entity.js"
import type { CategoryRepository } from "../../domain/category/repository.js"

export interface CreatePostInput {
    name: string
    content: string
    authorId: number
    categoryId: number
}

export interface PostService {
    getPosts(category?: string, categoryId?: number, take?: number): Promise<PostWithCategory[]>
    getPostById(id: number): Promise<PostWithCategory | undefined>
    createPost(input: CreatePostInput): Promise<Post | null | undefined>
}