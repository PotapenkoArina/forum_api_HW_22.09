import "dotenv/config"
import jwt from "jsonwebtoken"

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
