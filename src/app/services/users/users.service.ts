import { BadRequestException, Injectable } from '@nestjs/common'
import { Assert, Password, updateIntersection } from 'common'
import { CreateUserDto, UpdateUserDto, UserDto, UsersQueryDto } from './dto'
import { User } from './entities/user.entity'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async createUser(createUserDto: CreateUserDto) {
        const { email, password } = createUserDto

        const hashedPassword = await Password.hash(password)

        const createUser = {
            email,
            password: hashedPassword
        }

        const user = await this.usersRepository.create(createUser)

        return new UserDto(user)
    }

    async findUsers(usersQueryDto: UsersQueryDto) {
        const users = await this.usersRepository.find(usersQueryDto)

        const items = users.items.map((user) => new UserDto(user))

        return { ...users, items }
    }

    async getUser(userId: string) {
        const user = await this.getUserEntity(userId)

        return new UserDto(user)
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto) {
        const user = await this.getUserEntity(userId)

        const updateUser = updateIntersection(user, updateUserDto)

        const savedUser = await this.usersRepository.update(updateUser)

        Assert.deepEquals(savedUser, updateUser, 'The result is different from the update request')

        return new UserDto(savedUser)
    }

    async removeUser(userId: string) {
        const user = await this.getUserEntity(userId)

        await this.usersRepository.remove(user)
    }

    private async getUserEntity(userId: string) {
        const user = await this.usersRepository.findById(userId)

        Assert.defined(user, `User with ID ${userId} not found`)

        return user as User
    }
}
