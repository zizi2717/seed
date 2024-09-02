export class FatalException extends Error {
    constructor(message?: string) {
        super(message)
        this.name = 'FatalException'
    }
}

export class LogicException extends FatalException {
    constructor(message?: string) {
        super(message)
        this.name = 'LogicException'
    }
}

export class ConfigException extends Error {
    constructor(message?: string) {
        super(message)
        this.name = 'ConfigException'
    }
}

export class TransactionException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'TransactionException'
    }
}
