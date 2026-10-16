import type { CategoryRepository } from "../domain/category/repository.js"
import type { db } from "../prisma/db.js"

export function createCategoryRepository(database: typeof db): CategoryRepository {
    return {
        async getAll() {
            return await database.orm.public.Category.all()
        },

        async getById(id: number) {
            const category = await database.orm.public.Category.first({ id })
            return category ?? undefined
        },

        async findByName(name: string) {
            const category = await database.orm.public.Category.first({ name })
            return category ?? undefined
        },

        createCategory(data) {
            return database.orm.public.Category.create(data)
        }
    }
}
