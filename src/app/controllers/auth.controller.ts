import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common'
import { AdminDto } from 'app/services/admins'
import { AuthService } from 'app/services/auth'
import { UserDto } from 'app/services/users'
import { Assert } from 'common'
import { AdminLocalAuthGuard, LocalAuthGuard } from './authentications'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Req() req: { user: UserDto }) {
        Assert.defined(req.user, 'login failed. req.user is null.')

        const tokenPair = await this.authService.login(req.user)

        return tokenPair
    }

    @Post('admin/login')
    @UseGuards(AdminLocalAuthGuard)
    async adminLogin(@Req() req: { user: AdminDto }) {
        Assert.defined(req.user, 'Login failed. req.user is null.')

        const tokenPair = await this.authService.adminLogin(req.user)

        return tokenPair
    }

    @Post('refresh')
    async refreshToken(@Body('refreshToken') refreshToken: string) {
        const tokenPair = await this.authService.refreshTokenPair(refreshToken)

        if (!tokenPair) {
            throw new UnauthorizedException('refresh failed.')
        }

        return tokenPair
    }
}
