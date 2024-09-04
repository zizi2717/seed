import { compare, hash } from 'bcrypt'
import { LogicException } from 'common'
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

export function convertTimeToSeconds(timeString: string): number {
    const matches = timeString.match(/(\d+)\s*(s|m|h|d)?/g)

    if (!matches) {
        throw new Error('Invalid time string')
    }

    const times = matches.map((match) => {
        const [_, value, unit] = match.match(/(\d+)\s*(s|m|h|d)?/) as any
        let multiplier = 1

        switch (unit) {
            case 's':
                multiplier = 1
                break
            case 'm':
                multiplier = 60
                break
            case 'h':
                multiplier = 3600
                break
            case 'd':
                multiplier = 86400
                break
            default:
                throw new LogicException("Invalid time unit. It should be one of 's', 'm', 'h', 'd'")
        }

        return parseInt(value) * multiplier
    })

    return times.reduce((prev, curr) => prev + curr, 0)
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
