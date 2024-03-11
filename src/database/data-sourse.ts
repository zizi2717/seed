import { psqlOptions } from 'src/config'
import { DataSource } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

const entities = []
const migrations = []

export const psqlConnectionOptions = {
    ...psqlOptions,
    type: 'postgres',
    migrations,
    entities
} as PostgresConnectionOptions

export const AppDataSource = new DataSource(psqlConnectionOptions)
