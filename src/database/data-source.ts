import { psqlOptions } from 'src/config'
import { User } from 'src/services/users/entities/user.entity'
import { DataSource } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { Mig1719832848153 } from './migrations/1719832848153-mig'

const entities = [User]
const migrations = [Mig1719832848153]

export const psqlConnectionOptions = {
    ...psqlOptions,
    type: 'postgres',
    entities,
    migrations
} as PostgresConnectionOptions

export const AppDataSource = new DataSource(psqlConnectionOptions)
