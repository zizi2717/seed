import { Module } from '@nestjs/common'
import { CacheModule } from './cache.module'
import { DatabaseModule } from './database.module'
import { LoggerModule } from './logger.module'

@Module({
    imports: [DatabaseModule, CacheModule, LoggerModule]
})
export class GlobalModule {}
