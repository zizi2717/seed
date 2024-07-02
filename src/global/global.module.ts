import { Module } from '@nestjs/common'
import { CacheModule } from './cache.module'
import { DatabaseModule } from './database.module'

@Module({
    imports: [DatabaseModule, CacheModule]
})
export class GlobalModule {}
