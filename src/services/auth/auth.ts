import type { RefreshSessionRepository } from "../../domain/refresh-session/repository.js"
import type { UserRepository } from "../../domain/user/repository.js"
import type {
    AuthService,
    PasswordHasher,
    RefreshTokenHasher,
    TokenSign,
    TokenVerify
} from "./auth.types.js"

export function createAuthService(
    repository: UserRepository,
    passwordHasher: PasswordHasher,
    tokenSign: TokenSign,
    tokenVerify: TokenVerify,
    sessions: RefreshSessionRepository,
    refreshTokenHasher: RefreshTokenHasher
): AuthService {
    return {
        async register(input) {
            const email = input.email.trim().toLowerCase()
            const existingUser = await repository.getByEmail(email)
            if (existingUser) {
                throw new Error("EMAIL_ALREADY_EXISTS")
            }

            const passwordHash = await passwordHasher.hash(input.password)
            const user = await repository.createUser({ email, passwordHash })
            return { id: user.id, email: user.email }
        },

        async login(input) {
            const email = input.email.trim().toLowerCase()
            const user = await repository.getByEmail(email)
            if (!user || !await passwordHasher.verify(user.passwordHash, input.password)) {
                throw new Error("INVALID_DATA")
            }

            const accessToken = tokenSign.signAccessToken(user.id)
            const refreshToken = tokenSign.signRefreshToken(user.id)
            await sessions.create({
                userId: user.id,
                tokenHash: refreshTokenHasher.hash(refreshToken),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            })

            return {
                user: { id: user.id, email: user.email },
                accessToken,
                refreshToken
            }
        },

        async refresh(refreshToken) {
            const userId = tokenVerify.verifyRefreshToken(refreshToken)
            const oldHash = refreshTokenHasher.hash(refreshToken)
            const session = await sessions.getByHash(oldHash)
            if (!session || session.userId !== userId || session.expiresAt <= new Date()) {
                throw new Error("INVALID_REFRESH_TOKEN")
            }

            const user = await repository.getById(userId)
            if (!user) {
                throw new Error("INVALID_REFRESH_TOKEN")
            }

            const newRefreshToken = tokenSign.signRefreshToken(userId)
            const accessToken = tokenSign.signAccessToken(userId)
            const rotated = await sessions.rotate(
                oldHash,
                refreshTokenHasher.hash(newRefreshToken),
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            )
            if (!rotated) {
                throw new Error("INVALID_REFRESH_TOKEN")
            }

            return {
                accessToken,
                refreshToken: newRefreshToken
            }
        },

        async logout(refreshToken) {
            if (refreshToken) {
                await sessions.deleteByHash(refreshTokenHasher.hash(refreshToken))
            }
        }
    }
}
