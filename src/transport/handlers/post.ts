import type { PostService } from "../../services/post/post.types.js"
import type { Request, Response } from "express"
import type { CreatePostRequest } from "../dto/post/requests.js"

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

export interface PostHandlers { 
    getPosts(
        req: Request, 
        res: Response
    ): Promise<void | Response>
    getPostById(
        req: Request, 
        res: Response
    ): Promise<void | Response>
    createPost(
        req: Request, 
        res: Response
    ): Promise<void | Response>
}

export function createPostHandler(
    postService: PostService
): PostHandlers {
    return {
        async getPosts(req, res) {
            try { 
                if (Object.keys(req.query).some((key) => !["category", "categoryId", "take"].includes(key))) {
                    return res.status(422).json({ message: "Invalid query fields" })
                }

                const { category, categoryId, take } = req.query
                if (category !== undefined && (typeof category !== "string" || !category.trim())) {
                    return res.status(422).json({ message: "Invalid category filter" })
                }

                let parsedCategoryId: number | undefined
                if (categoryId !== undefined) {
                    parsedCategoryId = typeof categoryId === "string"
                        ? parsePositiveInteger(categoryId)
                        : undefined
                    if (parsedCategoryId === undefined) {
                        return res.status(400).json({ message: "categoryId must be a positive integer" })
                    }
                }

                let parsedTake: number | undefined
                if (take !== undefined) {
                    parsedTake = typeof take === "string" ? parsePositiveInteger(take) : undefined
                    if (parsedTake === undefined) {
                        return res.status(400).json({ message: "Take must be a positive integer" })
                    }
                }

                const posts = await postService.getPosts(
                    typeof category === "string" ? category.trim() : undefined,
                    parsedCategoryId,
                    parsedTake
                )
                return res.status(200).json(posts)
            } 
            catch (error) {
                console.error(error)
                return res.status(500).json({ message: "server error" })   
            }
        },

        async getPostById(req, res) {
            try {
                const { id } = req.params
                const postId = typeof id === "string" ? parsePositiveInteger(id) : undefined
                if (postId === undefined) {
                    return res.status(400).json({ message: 'Id must be a positive integer' })
                }

                const post = await postService.getPostById(postId)

                if (!post) {
                    return res.status(404).json({ message: 'Post not found' })
                }
                
                return res.status(200).json(post)
            } catch (error) {
                console.error(error)
                return res.status(500).json({ message: "server error" })
            }
        },

        async createPost(req, res) {
            try {
                const body: unknown = req.body
                if (!isObject(body) || Object.keys(body).some((key) =>
                    !["name", "content", "authorId", "categoryId"].includes(key)
                )) {
                    return res.status(422).json({ message: "Invalid post data" })
                }

                const name = body.name
                const content = body.content
                const authorId = body.authorId
                const categoryId = body.categoryId
                if (
                    typeof name !== "string" || !name.trim() ||
                    typeof content !== "string" || !content.trim()
                ) {
                    return res.status(422).json({ message: "Invalid post data" })
                }

                if (typeof authorId !== "number" || !Number.isSafeInteger(authorId) || authorId <= 0) {
                    return res.status(400).json({ message: "authorId must be a positive integer" })
                }

                if (typeof categoryId !== "number" || !Number.isSafeInteger(categoryId) || categoryId <= 0) {
                    return res.status(400).json({ message: "categoryId must be a positive integer" })
                }

                const request: CreatePostRequest = { name, content, authorId, categoryId }
                const createdPost = await postService.createPost(request)

                if (createdPost === undefined) {
                    return res.status(404).json({ message: "Category or author not found" })
                }
                
                if (!createdPost) {
                    return res.status(409).json({ message: "Post already exists" })
                }
                
                return res.status(201).json(createdPost)
            } catch (error) {
                console.error(error)
                return res.status(500).json({ message: "Server error" })
            }
        }
    } 
}