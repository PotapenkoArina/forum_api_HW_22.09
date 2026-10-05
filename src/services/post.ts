import type { PostRepository } from "../domain/post/repository.js"
import type { CreatePostInput, PostService } from "./post/post.types.js"

export function createPostService(repository: PostRepository): PostService {
    return {
        getPosts(category?: string, take?: number) {
            return repository.getAll(category, take)
        },
        
        getPostById(id: number) { 
            return repository.getById(id)
        },
        
        async createPost(input: CreatePostInput) {
            const name = input.name.trim()
            
            const duplicate = await repository.findByName(name)
            
            if (duplicate) {
                return null
            }
            
            return repository.createPost({
                name,
                content: input.content.trim(),
                author: input.author.trim(),
                category: input.category.trim()
            })
        }
    }
}