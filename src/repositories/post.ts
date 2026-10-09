import type { PostRepository } from "../domain/post/repository.js"
import type { db } from "../prisma/db.js"

export function createPostRepository(database: typeof db): PostRepository {
    return {
        async getAll(category?: string, take?: number) {
            if (category) {
                const query = database.orm.public.Post.where({ category })
                return take === undefined
                    ? query.all()
                    : query.limit(take).all()
            }

            const query = database.orm.public.Post
            return take === undefined
                ? query.all()
                : query.limit(take).all()
        },

        async getById(id: number) {
            const post = await database.orm.public.Post.first({ id })
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
            return database.orm.public.Post.create(data)
        }
    }
}