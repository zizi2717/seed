import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { Exception } from 'common'

@Injectable()
export class CacheService implements OnModuleDestroy {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    onModuleDestroy() {
        const client = (this.cacheManager.store as any).client
        client.disconnect()
    }

    async set(key: string, value: string, expireSeconds?: number | undefined): Promise<void> {
        const expireMiliseconds = expireSeconds ? expireSeconds * 1000 : 0

        if (0 < expireMiliseconds && expireMiliseconds < 1000) {
            throw new Exception('expireSeconds must be greater than 1000ms')
        } else if (expireMiliseconds < 0) {
            throw new Exception('expireSeconds must be greater than 0')
        }

        await this.cacheManager.set(key, value, expireMiliseconds)
    }

    async get(key: string): Promise<string | undefined> {
        return this.cacheManager.get(key)
    }

    async delete(key: string): Promise<void> {
        return this.cacheManager.del(key)
    }
}
