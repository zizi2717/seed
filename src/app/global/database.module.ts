import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { isDevelopment } from 'config'
import { psqlConnectionOptions } from 'database/data-source'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

const psqlModuleConfig = (): PostgresConnectionOptions => {
    const dropSchema = isDevelopment()
    const synchronize = isDevelopment()

    // TODO: Add logger

    const options = {
        ...psqlConnectionOptions,
        dropSchema,
        synchronize
    }

    return options
}

@Module({
    imports: [TypeOrmModule.forRootAsync({ useFactory: psqlModuleConfig })]
})
export class DatabaseModule {}
