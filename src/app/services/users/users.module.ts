import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService, UsersRepository],
    exports: [UsersService]
})
export class UsersModule {}
