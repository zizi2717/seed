import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common'
import { AuthService } from 'app/services/auth'
import { UserDto } from 'app/services/users'
import { Assert } from 'common'
import { LocalAuthGuard } from './guards'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: { user: UserDto }) {
        Assert.defined(req.user, 'login failed. req.user is null.')

        const tokenPair = await this.authService.login(req.user)

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
