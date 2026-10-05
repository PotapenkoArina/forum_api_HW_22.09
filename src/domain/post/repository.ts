import type { Post } from "./entity.js"

export type NewPost = Omit<Post, "id">

export interface PostRepository {
    getAll(category?: string, take?: number): Promise<Post[]>
    getById(id: number): Promise<Post | undefined>
    findByName(name: string): Promise<Post | undefined>
    createPost(data: NewPost): Promise<Post>
}