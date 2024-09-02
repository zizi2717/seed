import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginationResult, TypeormRepository } from 'common'
import { Repository } from 'typeorm'
import { User } from './entities'
import { UsersQueryDto } from './dto'

@Injectable()
export class UsersRepository extends TypeormRepository<User> {
    constructor(@InjectRepository(User) typeorm: Repository<User>) {
        super(typeorm)
    }

    async find(usersQueryDto: UsersQueryDto): Promise<PaginationResult<User>> {
        const { take, skip } = usersQueryDto

        const qb = this.createQueryBuilder(usersQueryDto)
        
        qb.where('1=1')

        if (usersQueryDto.email) {
            qb.orWhere('entity.email LIKE :email', {
                email: `%${usersQueryDto.email}%`
            })
        }

        const [items, total] = await qb.getManyAndCount()

        return { items, total, take, skip }
    }
}
