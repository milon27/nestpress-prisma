// used for reset password+email verification
import rateLimit from "express-rate-limit"
import RedisStore from "rate-limit-redis"
import { redisClient } from "../../config/redis.config"

/**
 * @requires "/:email" in route
 * @param keyPrefix string
 * @returns RateLimitRequestHandler (middleware)
 */
export const emailLimiter = (keyPrefix: string) =>
    rateLimit({
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
        max: 3, // 3 email can be sent
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        // Redis store configuration
        store: new RedisStore({
            prefix: keyPrefix,
            // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
            sendCommand: (...args: string[]) => redisClient.call(...args),
        }),
        keyGenerator: (req) => {
            return `${req.params.email}`
        },
        message:
            "you can get 3 forget password or email-verification link within 24 hours, please try again later.", // Set the error message to display when the rate limit is exceeded
    })
