import type { Request, Response } from "express"
import type { AuthService } from "../../services/auth/auth.types.js"
import type { AuthCredentialRequest } from "../dto/auth/requests.js"

export interface AuthHandlers {
    register(req: Request, res: Response): Promise<void | Response>
    login(req: Request, res: Response): Promise<void | Response>
    refresh(req: Request, res: Response): Promise<void | Response>
    logout(req: Request, res: Response): Promise<void | Response>
}

const secureCookies = process.env.NODE_ENV === "production"
const refreshCookiePath = "/auth"

function setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string }
): Response {
    return res
        .cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: secureCookies,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
            path: "/"
        })
        .cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: secureCookies,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: refreshCookiePath
        })
}

function readCookie(req: Request, name: string): string | undefined {
    const header = req.headers.cookie
    if (!header) {
        return undefined
    }
    const cookie = header
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`))
    if (!cookie) {
        return undefined
    }
    try {
        return decodeURIComponent(cookie.slice(name.length + 1))
    } catch {
        return undefined
    }
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
        body.password.length < 6
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
                return setAuthCookies(res, result)
                    .status(200)
                    .json({ user: result.user })
            } catch (error) {
                if (error instanceof Error && error.message === "INVALID_DATA") {
                    return res.status(401).json({ message: "Invalid email or password" })
                }
                console.error(error)
                return res.status(500).json({ message: "Server error" })
            }
        },

        async refresh(req, res) {
            const refreshToken = readCookie(req, "refreshToken")
            if (!refreshToken) {
                return res.status(401).json({ message: "Unauthorized" })
            }
            try {
                const tokens = await service.refresh(refreshToken)
                return setAuthCookies(res, tokens)
                    .status(200)
                    .json({ message: "Tokens updated" })
            } catch (error) {
                if (error instanceof Error && error.message === "INVALID_REFRESH_TOKEN") {
                    return res.status(401).json({ message: "Unauthorized" })
                }
                console.error(error)
                return res.status(500).json({ message: "Server error" })
            }
        },

        async logout(req, res) {
            try {
                await service.logout(readCookie(req, "refreshToken"))
                return res
                    .clearCookie("accessToken", {
                        httpOnly: true,
                        secure: secureCookies,
                        sameSite: "lax",
                        path: "/"
                    })
                    .clearCookie("refreshToken", {
                        httpOnly: true,
                        secure: secureCookies,
                        sameSite: "lax",
                        path: refreshCookiePath
                    })
                    .status(200)
                    .json({ message: "Logged out" })
            } catch (error) {
                console.error(error)
                return res.status(500).json({ message: "Server error" })
            }
        }
    }
}
