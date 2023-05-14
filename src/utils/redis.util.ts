// import redisDelByPattern, { RedisDeletionMethod } from "@eturino/ioredis-del-by-pattern"
import { redisClient } from "../config/redis.config"

export const RedisUtil = {
    getData: async <T>(key: string): Promise<T | undefined> => {
        const data = await redisClient.get(key)
        if (data) return JSON.parse(data)
        return undefined
    },
    setData: async <T>(key: string, value: T, expireAfterSeconds?: number): Promise<boolean> => {
        let data
        if (expireAfterSeconds) {
            data = await redisClient.set(key, JSON.stringify(value), "EX", expireAfterSeconds)
        } else {
            data = await redisClient.set(key, JSON.stringify(value))
        }
        if (data) return true
        return false
    },
    deleteData: async (key: string) => {
        await redisClient.del(key)
    },
    deleteByPattern: async (pattern: string) => {
        const keys = await redisClient.keys(pattern)
        await redisClient.del(keys)
        // await redisDelByPattern({
        //     pattern,
        //     redis: redisClient, // ioredis client
        //     withPipeline: true,
        //     deletionMethod: RedisDeletionMethod.unlink,
        // })
    },
}
