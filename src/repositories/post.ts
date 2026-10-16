import type { PostRepository } from "../domain/post/repository.js"
import type { db } from "../prisma/db.js"

export function createPostRepository(database: typeof db): PostRepository {
    return {
        async getAll(category?: string, categoryId?: number, take?: number) {
            let query = database.orm.public.Post.include("category")

            if (category !== undefined) {
                const matchedCategory = await database.orm.public.Category.first({ name: category })
                if (!matchedCategory) {
                    return []
                }
                query = query.where({ categoryId: matchedCategory.id })
            }

            if (categoryId !== undefined) {
                query = query.where({ categoryId })
            }

            return take === undefined
                ? await query.all()
                : await query.limit(take).all()
        },

        async getById(id: number) {
            const post = await database.orm.public.Post
                .include("category")
                .first({ id })
            return post ?? undefined
        },

        async findByName(name: string) {
            const pattern = name.replace(/[\\%_]/g, '\\$&')
            const post = await database.orm.public.Post
                .where((row) => row.name.ilike(pattern))
                .first()
            return post ?? undefined
        },

        createPost(data) {
            const { categoryId, ...postData } = data
            return database.orm.public.Post.create({
                ...postData,
                category: (category) => category.connect({ id: categoryId })
            })
        }
    }
}