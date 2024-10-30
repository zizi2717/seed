import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(Strategy, 'admin-local') {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        })
    }

    async validate(email: string, password: string): Promise<any> {
        const admin = await this.authService.getAdminWithPassword(email, password)

        if (!admin) {
            throw new UnauthorizedException('Invalid credentials.')
        }

        return admin
    }
}
