import type { UserRepository } from "../domain/user/repository.js"
import type { db } from "../prisma/db.js"

export function createUserRepository(database: typeof db): UserRepository {
    return {
        async getById(id) {
            const user = await database.orm.public.User.first({ id })
            return user ?? undefined
        },

        async getByEmail(email) {
            const user = await database.orm.public.User.where({ email }).first()
            return user ?? undefined
        },

        async createUser(data) {
            try {
                return await database.orm.public.User.create(data)
            } catch (error) {
                if (
                    error instanceof Error &&
                    "sqlState" in error &&
                    error.sqlState === "23505"
                ) {
                    throw new Error("EMAIL_ALREADY_EXISTS")
                }
                throw error
            }
        }
    }
}
