import { Admin } from '../entities'

export class AdminDto {
    id: string
    email: string
    name: string
    createdAt: Date
    updatedAt: Date

    constructor(admin: Admin) {
        const { id, email, name, createdAt, updatedAt } = admin

        Object.assign(this, { id, email, name, createdAt, updatedAt })
    }
}
