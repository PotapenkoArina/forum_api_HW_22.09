import type { Request, Response } from "express"
import type { AuthService } from "../../services/auth/auth.types.js"
import type { AuthCredentialRequest } from "../dto/auth/requests.js"

export interface AuthHandlers {
    register(req: Request, res: Response): Promise<void | Response>
    login(req: Request, res: Response): Promise<void | Response>
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

function readCredentials(body: unknown): AuthCredentialRequest | undefined {
    if (
        !isObject(body) ||
        Object.keys(body).some((key) => key !== "email" && key !== "password") ||
        typeof body.email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) ||
        typeof body.password !== "string" ||
        body.password.length < 8
    ) {
        return undefined
    }

    return { email: body.email, password: body.password }
}

export function createAuthHandler(service: AuthService): AuthHandlers {
    return {
        async register(req, res) {
            const credentials = readCredentials(req.body)
            if (!credentials) {
                return res.status(422).json({ message: "Invalid email or password" })
            }

            try {
                const user = await service.register(credentials)
                return res.status(201).json(user)
            } catch (error) {
                if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
                    return res.status(409).json({ message: "Email already exists" })
                }
                console.error(error)
                return res.status(500).json({ message: "Server error" })
            }
        },

        async login(req, res) {
            const credentials = readCredentials(req.body)
            if (!credentials) {
                return res.status(422).json({ message: "Invalid email or password" })
            }

            try {
                const result = await service.login(credentials)
                return res
                    .cookie("accessToken", result.accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 15 * 60 * 1000,
                        path: "/"
                    })
                    .status(200)
                    .json({ user: result.user })
            } catch (error) {
                if (error instanceof Error && error.message === "INVALID_DATA") {
                    return res.status(401).json({ message: "Invalid email or password" })
                }
                console.error(error)
                return res.status(500).json({ message: "Server error" })
            }
        }
    }
}
