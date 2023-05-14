import rateLimit from "express-rate-limit"
import RedisStore from "rate-limit-redis"
import { redisClient } from "../../config/redis.config"
import { KeyConstant } from "../../config/constant/key.constant"

// todo: update window if needed after testing with react app.
const window = 30 * 60 * 1000 // 30 minutes (access token expire will be 30 mint, so in 30 mint ideally refresh token hit only once so for worst case scenario we will give max 3)

export const refreshTokenLimiter = rateLimit({
    windowMs: window,
    max: 3, // limit each IP to 3 requests per windowMs
    message: "Too many requests from this IP, please try again after 30 minutes",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers

    // Redis store configuration
    store: new RedisStore({
        prefix: KeyConstant.RL_RT_MAX,
        // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
        sendCommand: (...args: string[]) => redisClient.call(...args),
    }),
})
