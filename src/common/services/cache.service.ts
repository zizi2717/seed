import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'
import { Cache } from 'cache-manager'

@Injectable()
export class CacheService implements OnModuleDestroy {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    onModuleDestroy() {
        const client = (this.cacheManager.store as any).client
        client.disconnect()
    }

    async set(key: string, value: string, expireSeconds = 0): Promise<void> {
        const expireMiliseconds = expireSeconds ? expireSeconds * 1000 : 0

        if (expireSeconds < 0) {
            throw new Error('ttlMiliseconds should not be negative')
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
