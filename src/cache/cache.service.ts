import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private redisClient!: Redis;

  async onModuleInit() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
    })

    console.log('[WORKFLOW HUB CACHE TIER]: Standalone Redis memory optimization grid active.');
  }

  // CACHE RETRIEVAL UTILITY (READ MULTIPLEXER)
  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  // CACHE STORAGE UTILITY WITH EXPLICIT SECONDS-BASED TTL BOUNDARIES
  async set(key: string, value: string, ttlSeconds: number = 300): Promise<void> {
    await this.redisClient.set(key, value, 'EX', ttlSeconds);
  }

  // CACHE INVALIDATION UTILITY (EVICTION ENGINE)
  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}