import type { CategoryRepository } from "../domain/category/repository.js"
import type { CreateCategoryInput, CategoryService } from "./category/category.types.js"

export function createCategoryService(repository: CategoryRepository): CategoryService {
    return {
        getCategories() {
            return repository.getAll()
        },

        getCategoryById(id: number) {
            return repository.getById(id)
        },

        async createCategory(input: CreateCategoryInput) {
            const name = input.name.trim()
            const duplicate = await repository.findByName(name)

            if (duplicate) {
                return null
            }

            return repository.createCategory({ name })
        }
    }
}
