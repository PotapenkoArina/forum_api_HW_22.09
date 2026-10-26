import type { Category } from "../category/entity.js"
import type { PublicUser } from "../user/entity.js"

export interface Post {
    id: number
    name: string
    content: string
    authorId: number | null
    categoryId: number
}

export type PostWithCategory = Post & { category: Category; author: PublicUser | null }