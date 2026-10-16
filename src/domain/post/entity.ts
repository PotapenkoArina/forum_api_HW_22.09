import type { Category } from "../category/entity.js"

export interface Post {
    id: number
    name: string
    content: string
    author: string
    categoryId: number
}

export type PostWithCategory = Post & { category: Category }