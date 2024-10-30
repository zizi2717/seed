import { Injectable } from '@nestjs/common'
import { Assert, Password } from 'common'
import { AdminsRepository } from './admins.repository'
import { AdminDto } from './dto'
import { Admin } from './entities/admin.entity'

@Injectable()
export class AdminsService {
    constructor(private adminsRepository: AdminsRepository) {}

    async getAdminEntity(adminId: string) {
        const admin = await this.adminsRepository.findById(adminId)

        Assert.defined(admin, `Admin with ID ${adminId} not found`)

        return admin as Admin
    }

    async findByEmail(email: string): Promise<AdminDto | null> {
        const admin = await this.adminsRepository.findByEmail(email)

        if (admin) {
            return new AdminDto(admin)
        }

        return null
    }

    async isCorrectPassword(adminId: string, password: string) {
        const admin = await this.getAdminEntity(adminId)

        return Password.validate(password, admin.password)
    }
}
