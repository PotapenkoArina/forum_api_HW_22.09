import type { PostRepository } from "../domain/post/repository.js"
import type { Category } from "../domain/category/entity.js"
import type { PublicUser } from "../domain/user/entity.js"
import type { PostWithCategory } from "../domain/post/entity.js"
import type { db } from "../prisma/db.js"

function hideAuthorPassword(post: {
    id: number
    name: string
    content: string
    authorId: number | null
    authorName: string | null
    categoryId: number
    category: Category
    author: (PublicUser & { passwordHash: string }) | null
}): PostWithCategory {
    const author = post.author
        ? { id: post.author.id, email: post.author.email }
        : null
    return {
        id: post.id,
        name: post.name,
        content: post.content,
        authorId: post.authorId,
        categoryId: post.categoryId,
        category: post.category,
        author
    }
}

export function createPostRepository(database: typeof db): PostRepository {
    return {
        async getAll(category?: string, categoryId?: number, take?: number) {
            let query = database.orm.public.Post.include("category").include("author")

            if (category !== undefined) {
                const matchedCategory = await database.orm.public.Category.first({ name: category })
                if (!matchedCategory) {
                    return []
                }
                query = query.where({ categoryId: matchedCategory.id })
            }

            if (categoryId !== undefined) {
                query = query.where({ categoryId })
            }

            const posts = take === undefined
                ? await query.all()
                : await query.limit(take).all()
            return posts.map(hideAuthorPassword)
        },

        async getById(id: number) {
            const post = await database.orm.public.Post
                .include("category")
                .include("author")
                .first({ id })
            return post ? hideAuthorPassword(post) : undefined
        },

        async findByName(name: string) {
            const pattern = name.replace(/[\\%_]/g, '\\$&')
            const post = await database.orm.public.Post
                .where((row) => row.name.ilike(pattern))
                .first()
            return post ?? undefined
        },

        createPost(data) {
            const { categoryId, authorId, ...postData } = data
            return database.orm.public.Post
                .include("category")
                .include("author")
                .create({
                    ...postData,
                    category: (category) => category.connect({ id: categoryId }),
                    author: (author) => author.connect([{ id: authorId }])
                })
                .then(hideAuthorPassword)
        }
    }
}