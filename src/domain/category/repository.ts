import type { Category } from "./entity.js"

export type NewCategory = Omit<Category, "id">

export interface CategoryRepository {
    getAll(): Promise<Category[]>
    getById(id: number): Promise<Category | undefined>
    findByName(name: string): Promise<Category | undefined>
    createCategory(data: NewCategory): Promise<Category>
}
