import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CreateUserDto, UpdateUserDto, UsersQueryDto, UsersService } from 'app/services'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto)
    }

    @Get()
    async findUsers(@Query() usersQueryDto: UsersQueryDto) {
        return this.usersService.findUsers(usersQueryDto)
    }

    @Get(':userId')
    async getUser(@Param('userId') userId: string) {
        return this.usersService.getUser(userId)
    }

    @Patch(':userId')
    async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateUser(userId, updateUserDto)
    }

    @Delete(':userId')
    async removeUser(@Param('userId') userId: string) {
        return this.usersService.removeUser(userId)
    }
}
