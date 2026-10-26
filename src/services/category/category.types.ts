import type { Category } from "../../domain/category/entity.js"

export interface CreateCategoryInput {
    name: string
}

export interface CategoryService {
    getCategories(): Promise<Category[]>
    getCategoryById(id: number): Promise<Category | undefined>
    createCategory(input: CreateCategoryInput): Promise<Category | null>
}
