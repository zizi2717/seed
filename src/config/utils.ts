import { exit } from 'process'

export function getString(key: string): string {
    const value = process.env[key]

    if (!value) {
        exit(1)
    }

    return value
}

export function getNumber(key: string): number {
    const value = getString(key)

    const number = parseInt(value)

    if (isNaN(number)) {
        exit(1)
    }

    return number
}

export function getBoolean(key: string): boolean {
    const value = getString(key)

    if (value.toLowerCase() === 'true') return true
    if (value.toLowerCase() === 'false') return false

    exit(1)
}
