import { Temporal } from "@js-temporal/polyfill"
import type { RefreshSessionRepository } from "../domain/refresh-session/repository.js"
import type { db } from "../prisma/db.js"

type DataBase = typeof db

function toInstant(date: Date) {
    return Temporal.Instant.fromEpochMilliseconds(date.getTime()) as never
}

function toDate(instant: { epochMilliseconds: number }): Date {
    return new Date(instant.epochMilliseconds)
}

export function createRefreshSessionRepository(database: DataBase): RefreshSessionRepository {
    return {
        async create(data) {
            await database.orm.public.RefreshSession.create({
                ...data,
                expiresAt: toInstant(data.expiresAt)
            })
        },

        async getByHash(hash) {
            const session = await database.orm.public.RefreshSession.where({ tokenHash: hash }).first()
            if (!session) {
                return null
            }
            return {
                ...session,
                expiresAt: toDate(session.expiresAt),
                createdAt: toDate(session.createdAt)
            }
        },

        async rotate(oldHash, newHash, expiresAt) {
            const updated = await database.orm.public.RefreshSession.where({ tokenHash: oldHash })
                .update({ tokenHash: newHash, expiresAt: toInstant(expiresAt) })
            return updated !== null
        },

        async deleteByHash(hash) {
            await database.orm.public.RefreshSession.where({ tokenHash: hash }).delete()
        }
    }
}
