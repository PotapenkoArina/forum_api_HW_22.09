import type { Post } from "../domain/post/entity.js"
import type { PostRepository } from "../domain/post/repository.js"

export function createPostRepository(): PostRepository {
    let posts: Post[] = [
        { 
            id: 1,
            name: "1", 
            content: "thdfvsvdf", 
            author: "Arina", 
            category: "sgsd"
        },
        { 
            id: 2, 
            name: " 2", 
            content: "ssrgdf", 
            author: "Kira", 
            category: "sgbhds" 
        },
        { 
            id: 3, 
            name: " 3", 
            content: "dfhdgne", 
            author: "Polya", 
            category: "dehnbgdsn" 
        }
    ]

    return {
        async getAll(category?: string, take?: number) {
            let result = [...posts]
            if (category) {
                result = result.filter(post => post.category === category)
            }
            return take === undefined ? result : result.slice(0, take)
        },

        async getById(id: number) {
            return posts.find((post) => post.id === id)
        },

        async findByName(name: string) {
            return posts.find((post) => post.name.toLowerCase() === name.toLowerCase())
        },

        async createPost(data) {
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 500)
            })
            const newId = posts.length + 1
            const newPost: Post = {
                id: newId,
                ...data
            }
            posts = [...posts, newPost]
            return newPost
        }
    }
}