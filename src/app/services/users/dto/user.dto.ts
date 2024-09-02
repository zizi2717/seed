import { User } from '../entities'

export class UserDto {
    id: string
    email: string
    name: string

    constructor(user: User) {
        const { id, email, name } = user

        Object.assign(this, { id, email, name })
    }
}
