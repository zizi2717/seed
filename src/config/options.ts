import * as dotenv from 'dotenv'
import { getNumber, getString } from './utils'

dotenv.config({ path: '.env' })

export function isProduction() {
    return process.env.NODE_ENV === 'production'
}

export function isDevelopment() {
    return process.env.NODE_ENV === 'development'
}

export const logOptions = {
    logDirectory: getString('LOG_DIRECTORY'),
    daysToKeepLogs: getString('LOG_DAYS_TO_KEEP'),
    fileLogLevel: getString('LOG_FILE_LEVEL'),
    consoleLogLevel: getString('LOG_CONSOLE_LEVEL'),
    logAuthKey: getString('LOG_AUTH_KEY')
}

export const psqlOptions = {
    host: getString('POSTGRES_DB_HOST'),
    port: getNumber('POSTGRES_DB_PORT'),
    username: getString('POSTGRES_DB_USERNAME'),
    password: getString('POSTGRES_DB_PASSWORD'),
    database: getString('POSTGRES_DB_DATABASE'),
    schema: getString('POSTGRES_DB_SCHEMA'),
    poolSize: getNumber('POSTGRES_DB_POOL_SIZE')
}

export const redisOptions = {
    host: getString('REDIS_HOST'),
    port: getNumber('REDIS_PORT')
}

export const authOptions = {
    accessSecret: getString('AUTH_ACCESS_SECRET'),
    accessTokenExpiration: getString('AUTH_ACCESS_TOKEN_EXPIRATION'),
    refreshSecret: getString('AUTH_REFRESH_SECRET'),
    refreshTokenExpiration: getString('AUTH_REFRESH_TOKEN_EXPIRATION')
}

export const emailOptions = {
    accessKey: getString('EMAIL_ACCESS_KEY'),
    secretAccessKey: getString('EMAIL_SECRET_ACCESS_KEY')
}

export const s3Options = {
    accessKeyId: getString('S3_ACCESS_KEY_ID'),
    secretAccessKey: getString('S3_SECRET_ACCESS_KEY'),
    endpoint: getString('S3_ENDPOINT'),
    region: getString('S3_REGION'),
    bucket: getString('S3_ACCESS_KEY_ID')
}
