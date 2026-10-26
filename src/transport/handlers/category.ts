import type { Request, Response } from "express"
import type { CategoryService } from "../../services/category/category.types.js"
import type { CreateCategoryRequest } from "../dto/category/requests.js"

export interface CategoryHandlers {
    getCategories(req: Request, res: Response): Promise<void | Response>
    getCategoryById(req: Request, res: Response): Promise<void | Response>
    createCategory(req: Request, res: Response): Promise<void | Response>
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

function parsePositiveInteger(value: string): number | undefined {
    if (!/^[1-9]\d*$/.test(value)) {
        return undefined
    }

    const parsed = Number(value)
    return Number.isSafeInteger(parsed) ? parsed : undefined
}

export function createCategoryHandler(service: CategoryService): CategoryHandlers {
    return {
        async getCategories(_req, res) {
            try {
                const categories = await service.getCategories()
                return res.status(200).json(categories)
            } catch (error) {
                console.error(error)
                return res.status(500).json({ message: "Server error" })
            }
        },

        async getCategoryById(req, res) {
            try {
                const param = req.params.id
                const id = typeof param === "string" ? parsePositiveInteger(param) : undefined
                if (id === undefined) {
                    return res.status(400).json({ message: "Id must be a positive integer" })
                }

                const category = await service.getCategoryById(id)
                if (!category) {
                    return res.status(404).json({ message: "Category not found" })
                }

                return res.status(200).json(category)
            } catch (error) {
                console.error(error)
                return res.status(500).json({ message: "Server error" })
            }
        },

        async createCategory(req, res) {
            try {
                const body: unknown = req.body
                if (!isObject(body) || Object.keys(body).some((key) => key !== "name")) {
                    return res.status(422).json({ message: "Invalid category data" })
                }

                const name = body.name
                if (typeof name !== "string" || !name.trim()) {
                    return res.status(422).json({ message: "Invalid category data" })
                }

                const request: CreateCategoryRequest = { name }
                const category = await service.createCategory(request)
                if (!category) {
                    return res.status(409).json({ message: "Category already exists" })
                }

                return res.status(201).json(category)
            } catch (error) {
                console.error(error)
                return res.status(500).json({ message: "Server error" })
            }
        }
    }
}
