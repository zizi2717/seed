import { compare, hash } from 'bcrypt'
import { randomUUID } from 'crypto'

export function generateUUID() {
    return randomUUID()
}

export function updateIntersection<T extends object>(obj1: T, obj2: any): T {
    const updatedObject = Object.keys(obj2).reduce(
        (updated, key) => {
            if (key in updated) {
                updated[key as keyof T] = obj2[key]
            }
            return updated
        },
        { ...obj1 }
    )

    return updatedObject
}

export class Password {
    static async hash(password: string): Promise<string> {
        const saltRounds = 10

        const hashedPassword = await hash(password, saltRounds)
        return hashedPassword
    }

    static validate(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return compare(plainPassword, hashedPassword)
    }
}
