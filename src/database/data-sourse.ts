import { psqlOptions } from 'src/config'
import { User } from 'src/services/users/entities/user.entity'
import { DataSource } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { Mig1700199870000 } from './migrations/1700199870000-mig'

const entities = [User]
const migrations = [Mig1700199870000]

export const psqlConnectionOptions = {
    ...psqlOptions,
    type: 'postgres',
    entities,
    migrations
} as PostgresConnectionOptions

export const AppDataSource = new DataSource(psqlConnectionOptions)
