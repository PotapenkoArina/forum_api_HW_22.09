import type { PostService } from "../../services/post/post.types.js"
import type { Request, Response } from "express"
import type { CreatePostRequest } from "../dto/post/requests.js"

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
                const { category, take } = req.query
                const categoryString = typeof category === 'string' ? category : undefined

                if (!take) {
                    const posts = await postService.getPosts(categoryString)
                    return res.status(200).json(posts)
                }
                
                const takeNumber = Number(take)
                
                if (!Number.isInteger(takeNumber) || takeNumber <= 0) {
                    return res.status(400).json({ message: 'Take must be a positive integer' })
                } 
                
                const posts = await postService.getPosts(categoryString, takeNumber)
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
                const postId = Number(id)
                
                if (!Number.isInteger(postId) || postId <= 0) {
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
                const { name, content, author, category }: CreatePostRequest = req.body || {}
                
                if (
                    typeof name !== 'string' || !name.trim() || 
                    typeof content !== 'string' || !content.trim() ||
                    typeof author !== 'string' || !author.trim() ||
                    typeof category !== 'string' || !category.trim()
                ) {
                    return res.status(422).json({ message: "invalid post data" })
                }
                
                const createdPost = await postService.createPost({ name, content, author, category })
                
                if (!createdPost) {
                    return res.status(409).json({ message: "Post already exists" })
                }
                
                return res.status(201).json(createdPost)
            } catch (error) {
                console.error(error)
                return res.status(500).json({ message: 'Failed to create' })
            }
        }
    } 
}