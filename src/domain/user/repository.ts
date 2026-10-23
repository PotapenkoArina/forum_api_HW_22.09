import type { User } from "./entity.js"

export type NewUser = Omit<User, "id">

export interface UserRepository {
    getById(id: number): Promise<User | undefined>
    getByEmail(email: string): Promise<User | undefined>
    createUser(data: NewUser): Promise<User>
}
