import { Router } from "express"
import type { AuthHandlers } from "../handlers/auth.js"

export function createAuthRouter(handlers: AuthHandlers) {
    const router = Router()
    router.post("/register", handlers.register)
    router.post("/login", handlers.login)
    router.post("/refresh", handlers.refresh)
    router.post("/logout", handlers.logout)
    return router
}
