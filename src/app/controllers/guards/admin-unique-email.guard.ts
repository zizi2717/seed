import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common'
import { AdminsService } from 'app/services/admins'

@Injectable()
export class AdminUniqueEmailGuard implements CanActivate {
    constructor(private readonly adminsService: AdminsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const email = request.body.email

        const emailExists = await this.adminsService.emailExists(email)

        if (emailExists) {
            throw new ConflictException(`Admin with email '${email}' already exists`)
        }

        return true
    }
}
