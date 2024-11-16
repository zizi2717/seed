import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common'
import { AdminsService } from 'app/services/admins'

@Injectable()
export class AdminExistsGuard implements CanActivate {
    constructor(private readonly adminsService: AdminsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const adminId = request.params.adminId

        const adminExists = await this.adminsService.adminExists(adminId)

        if (!adminExists) {
            throw new NotFoundException(`Admin with ID ${adminId} not found`)
        }

        return true
    }
}
