import Redis from 'ioredis';

const getRedisUrl = () => {
  return process.env.REDIS_URL;
};

const globalForRedis = globalThis as unknown as {
  redis: Redis | null | undefined;
};

const redisUrl = getRedisUrl();

export const redis: Redis | null = redisUrl
  ? (globalForRedis.redis ?? new Redis(redisUrl))
  : null;

if (process.env.NODE_ENV !== 'production' && redis) {
  globalForRedis.redis = redis;
}

// 检查 Redis 是否可用
export const isRedisEnabled = () => redis !== null;