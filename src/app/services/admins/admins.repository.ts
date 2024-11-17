import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginationResult, TypeormRepository } from 'common'
import { FindOptionsWhere, Repository } from 'typeorm'
import { AdminsQueryDto } from './dto'
import { Admin } from './entities/admin.entity'

@Injectable()
export class AdminsRepository extends TypeormRepository<Admin> {
    constructor(@InjectRepository(Admin) typeorm: Repository<Admin>) {
        super(typeorm)
    }

    async find(queryDto: AdminsQueryDto): Promise<PaginationResult<Admin>> {
        const { take, skip } = queryDto

        const qb = this.createQueryBuilder(queryDto)

        const [items, total] = await qb.getManyAndCount()

        return { items, total, take, skip }
    }

    async findByEmail(email: string): Promise<Admin | null> {
        return this.typeorm.findOneBy({ email })
    }

    async emailExists(email: string): Promise<boolean> {
        return this.typeorm.exist({
            where: { email } as FindOptionsWhere<Admin>
        })
    }
}
