import type { PostRepository } from "../domain/post/repository.js"
import type { CategoryRepository } from "../domain/category/repository.js"
import type { UserRepository } from "../domain/user/repository.js"
import type { CreatePostInput, PostService } from "./post/post.types.js"

export function createPostService(
    repository: PostRepository,
    categoryRepository: CategoryRepository,
    userRepository: UserRepository
): PostService {
    return {
        getPosts(category?: string, categoryId?: number, take?: number) {
            return repository.getAll(category, categoryId, take)
        },
        
        getPostById(id: number) { 
            return repository.getById(id)
        },
        
        async createPost(input: CreatePostInput) {
            const name = input.name.trim()
            const category = await categoryRepository.getById(input.categoryId)
            const author = await userRepository.getById(input.authorId)

            if (!category || !author) {
                return undefined
            }
            
            const duplicate = await repository.findByName(name)
            
            if (duplicate) {
                return null
            }
            
            return repository.createPost({
                name,
                content: input.content.trim(),
                authorId: input.authorId,
                categoryId: input.categoryId
            })
        }
    }
}