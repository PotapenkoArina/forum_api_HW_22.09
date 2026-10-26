import type { Post, PostWithCategory } from "./entity.js"

export type NewPost = Omit<Post, "id" | "authorId"> & { authorId: number }

export interface PostRepository {
    getAll(category?: string, categoryId?: number, take?: number): Promise<PostWithCategory[]>
    getById(id: number): Promise<PostWithCategory | undefined>
    findByName(name: string): Promise<Post | undefined>
    createPost(data: NewPost): Promise<PostWithCategory>
}