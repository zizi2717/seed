import { Global, Module } from '@nestjs/common'
import { DatabaseModule } from './database.module'

@Global()
@Module({
    imports: [DatabaseModule]
})
export class GlobalModule {}
