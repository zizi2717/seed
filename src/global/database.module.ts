import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { isDevelopment } from 'src/config'
import { psqlConnectionOptions } from 'src/database'
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
