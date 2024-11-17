import { Injectable } from '@nestjs/common'
import { Assert, Password, updateIntersection } from 'common'
import { AdminsRepository } from './admins.repository'
import { AdminDto, AdminsQueryDto, CreateAdminDto, UpdateAdminDto } from './dto'
import { Admin } from './entities/admin.entity'

@Injectable()
export class AdminsService {
    constructor(private adminsRepository: AdminsRepository) {}

    async createAdmin(createAdminDto: CreateAdminDto) {
        const { email, password } = createAdminDto

        const hashedPassword = await Password.hash(password)

        const createAdmin = {
            email,
            password: hashedPassword
        }

        const admin = await this.adminsRepository.create(createAdmin)

        return new AdminDto(admin)
    }

    async findAdmins(adminsQueryDto: AdminsQueryDto) {
        const admins = await this.adminsRepository.find(adminsQueryDto)

        const items = admins.items.map((admin) => new AdminDto(admin))

        return { ...admins, items }
    }

    async getAdmin(adminId: string) {
        const admin = await this.getAdminEntity(adminId)

        return new AdminDto(admin)
    }

    async updateAdmin(adminId: string, updateAdminDto: UpdateAdminDto) {
        const admin = await this.getAdminEntity(adminId)

        const updateAdmin = updateIntersection(admin, updateAdminDto)

        const savedAdmin = await this.adminsRepository.update(updateAdmin)

        Assert.deepEquals(savedAdmin, updateAdmin, 'The result is different from the update request')

        return new AdminDto(savedAdmin)
    }

    async removeAdmin(adminId: string) {
        const admin = await this.getAdminEntity(adminId)

        await this.adminsRepository.remove(admin)
    }

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

    async emailExists(email: string) {
        const exists = await this.adminsRepository.emailExists(email)

        return exists
    }

    async adminExists(adminId: string) {
        const exists = await this.adminsRepository.exist(adminId)

        return exists
    }
}
