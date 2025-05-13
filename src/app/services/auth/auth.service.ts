import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserDto, UsersService } from 'app/services/users'
import { CacheService, convertTimeToSeconds, generateUUID } from 'common'
import { authOptions } from 'config'
import { AccessTokenPayload, AuthTokenPair } from './interfaces'

const REFRESH_TOKEN_PREFIX = 'refreshToken:'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly cache: CacheService
    ) {}

    private async createToken(payload: AccessTokenPayload, secret: string, expiresIn: string): Promise<string> {
        const token = await this.jwtService.signAsync(
            { ...payload, jti: generateUUID() },
            { secret, expiresIn }
        )

        return token
    }

    async refreshTokenPair(refreshToken: string) {
        const tokenPayload = await this.getRefreshTokenPayload(refreshToken)

        if (tokenPayload) {
            const tokenPair = await this.getAuthTokenPair(refreshToken)

            return tokenPair
        }

        return null
    }

    private async getRefreshTokenPayload(token: string): Promise<AccessTokenPayload> {
        try {
            const secret = authOptions.refreshSecret

            const { exp, iat, jti, ...payload } = await this.jwtService.verifyAsync(token, { secret })

            return payload
        } catch (error) {
            throw new UnauthorizedException(error.message)
        }
    }

    async getUserWithPassword(email: string, password: string): Promise<UserDto | null> {
        const user = await this.usersService.findByEmail(email)

        if (user) {
            const isCorrectPassword = await this.usersService.isCorrectPassword(user.id, password)

            if (isCorrectPassword) {
                return user
            }
        }

        return null
    }

    async login(user: UserDto) {
        return this.generateAuthTokenPair(user.id, user.email)
    }

    private async generateAuthTokenPair(userId: string, email: string): Promise<AuthTokenPair> {
        const commonPayload = { userId, email }

        const accessToken = await this.createToken(
            commonPayload,
            authOptions.accessSecret,
            authOptions.accessTokenExpiration
        )

        const refreshToken = await this.createToken(
            commonPayload,
            authOptions.refreshSecret,
            authOptions.refreshTokenExpiration
        )

        await this.storeRefreshToken(userId, refreshToken)

        return { accessToken, refreshToken }
    }

    private async storeRefreshToken(userId: string, refreshToken: string) {
        const expireTime = convertTimeToSeconds(authOptions.refreshTokenExpiration)

        await this.cache.set(
            `${REFRESH_TOKEN_PREFIX}${userId}`,
            refreshToken,
            expireTime
        )
    }

    private async getStoredRefreshToken(userId: string): Promise<string | undefined> {
        return this.cache.get(`${REFRESH_TOKEN_PREFIX}${userId}`)
    }

    async getAuthTokenPair(refreshToken: string) {
        const tokenPayload = (await this.getRefreshTokenPayload(refreshToken)) as AccessTokenPayload

        if (tokenPayload) {
            const storedRefreshToken = await this.getStoredRefreshToken(tokenPayload.userId)

            if (storedRefreshToken === refreshToken) {
                return this.generateAuthTokenPair(tokenPayload.userId, tokenPayload.email)
            }
        }

        return null
    }

    // WebSocket
    verifyToken(token: string): { userId: string } | null {
        try {
            const decoded = jwt.verify(token, this.secret)
        
            return decoded as { userId: string }
        } catch (err) {
            return null
        }
    }
}
