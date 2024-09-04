import { Module } from '@nestjs/common'
import { AuthController, UsersController } from 'app/controllers'
import { GlobalModule } from 'app/global'
import { UsersModule } from 'app/services'
import { AuthModule } from 'app/services/auth'

@Module({
    imports: [GlobalModule, UsersModule, AuthModule],
    controllers: [UsersController, AuthController]
})
export class AppModule {}
