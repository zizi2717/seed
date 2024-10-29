import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeormRepository } from 'common'
import { Repository } from 'typeorm'
import { Admin } from './entities/admin.entity'

@Injectable()
export class AdminsRepository extends TypeormRepository<Admin> {
    constructor(@InjectRepository(Admin) typeorm: Repository<Admin>) {
        super(typeorm)
    }
}
