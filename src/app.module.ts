import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GlobalModule } from './global'

@Module({
    imports: [GlobalModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
