import { Module } from '@nestjs/common'
import { GlobalModule } from 'app/global'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
    imports: [GlobalModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
