import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AdminDto, AdminsService } from 'app/services/admins'
import { UserDto, UsersService } from 'app/services/users'
import { CacheService, convertTimeToSeconds, generateUUID } from 'common'
import { authOptions } from 'config'
import { AccessTokenPayload, AdminTokenPayload, AuthTokenPair } from './interfaces'

const REFRESH_TOKEN_PREFIX = 'refreshToken:'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly adminsService: AdminsService,
        private readonly jwtService: JwtService,
        private readonly cache: CacheService
    ) {}

    private async createToken(
        payload: AccessTokenPayload | AdminTokenPayload,
        secret: string,
        expiresIn: string
    ): Promise<string> {
        const token = await this.jwtService.signAsync(
            { ...payload, jti: generateUUID() },
            { secret, expiresIn }
        )

        return token
    }

    async refreshTokenPair(refreshToken: string) {
        const tokenPayload = await this.getRefreshTokenPayload(refreshToken)

        if (tokenPayload) {
            const tokenPair =
                'adminId' in tokenPayload
                    ? await this.getAdminTokenPair(refreshToken)
                    : await this.getAuthTokenPair(refreshToken)

            return tokenPair
        }

        return null
    }

    private async getRefreshTokenPayload(token: string): Promise<AccessTokenPayload | AdminTokenPayload | undefined> {
        try {
            const secret = authOptions.refreshSecret

            const { exp, iat, jti, ...payload } = await this.jwtService.verifyAsync(token, { secret })

            return payload
        } catch (error) {
            // TODO: Add exception
        }

        return undefined
    }

    /*
     * User
     */
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

    /*
     * Admin
     */
    async getAdminWithPassword(email: string, password: string): Promise<AdminDto | null> {
        const admin = await this.adminsService.findByEmail(email)

        if (admin) {
            const isCorrectPassword = await this.adminsService.isCorrectPassword(admin.id, password)

            if (isCorrectPassword) {
                return admin
            }
        }

        return null
    }

    async adminLogin(admin: AdminDto) {
        return this.generateAdminTokenPair(admin.id, admin.email)
    }

    private async generateAdminTokenPair(adminId: string, email: string): Promise<AuthTokenPair> {
        const commonPayload = { adminId, email }

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

        await this.storeRefreshToken(adminId, refreshToken)

        return { accessToken, refreshToken }
    }

    async getAdminTokenPair(refreshToken: string) {
        const tokenPayload = (await this.getRefreshTokenPayload(refreshToken)) as AdminTokenPayload

        if (tokenPayload) {
            const storedRefreshToken = await this.getStoredRefreshToken(tokenPayload.adminId)

            if (storedRefreshToken === refreshToken) {
                return this.generateAdminTokenPair(tokenPayload.adminId, tokenPayload.email)
            }
        }

        return null
    }
}
