import { myLogger } from "../config/logger"
import { redisClient } from "../config/redis.config"

// we are using redis for block refresh token, otp
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
    deleteByPattern: (pattern: string) => {
        // Create a readable stream (object mode)
        const stream = redisClient.scanStream({
            match: pattern,
        })
        stream.on("data", async (keys) => {
            // `keys` is an array of strings representing key names
            if (keys.length) {
                const pipeline = redisClient.pipeline()
                keys.forEach((key: string) => {
                    pipeline.del(key)
                })
                await pipeline.exec()
            }
        })
        stream.on("end", () => {
            myLogger().info("all keys deleted")
        })

        // or you can use this library
        // import redisDelByPattern, { RedisDeletionMethod } from "@eturino/ioredis-del-by-pattern"
        // await redisDelByPattern({
        //     pattern,
        //     redis: redisClient, // ioredis client
        //     withPipeline: true,
        //     deletionMethod: RedisDeletionMethod.unlink,
        // })
    },
    clear: async () => {
        await redisClient.flushdb()
    },
}
