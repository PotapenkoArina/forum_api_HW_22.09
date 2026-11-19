import "dotenv/config"
import jwt from "jsonwebtoken"
import { createHash, randomUUID } from "node:crypto"

export function signAccessToken(userId: number): string {
    const secret = process.env.JWT_ACCESS_SECRET
    if (!secret || secret.length < 32) {
        throw new Error("JWT_ACCESS_SECRET must contain at least 32 characters")
    }

    return jwt.sign({}, secret, {
        algorithm: "HS256",
        subject: String(userId),
        expiresIn: "15m"
    })
}

function getRefreshSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET
    if (!secret || secret.length < 32) {
        throw new Error("JWT_REFRESH_SECRET must contain at least 32 characters")
    }
    return secret
}

export function signRefreshToken(userId: number): string {
    return jwt.sign({ type: "refresh" }, getRefreshSecret(), {
        algorithm: "HS256",
        subject: String(userId),
        jwtid: randomUUID(),
        expiresIn: "7d"
    })
}

export function verifyRefreshToken(token: string): number {
    const secret = getRefreshSecret()
    try {
        const payload = jwt.verify(token, secret, { algorithms: ["HS256"] })
        if (
            typeof payload === "string" ||
            typeof payload.sub !== "string" ||
            payload.type !== "refresh" ||
            typeof payload.jti !== "string"
        ) {
            throw new Error()
        }
        const userId = Number(payload.sub)
        if (!Number.isSafeInteger(userId) || userId <= 0) {
            throw new Error()
        }
        return userId
    } catch {
        throw new Error("INVALID_REFRESH_TOKEN")
    }
}

export function hashRefreshToken(token: string): string {
    return createHash("sha256").update(token).digest("hex")
}
