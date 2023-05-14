import { generate } from "otp-generator"
import { RedisUtil } from "./redis.util"

const storeAndGetOtp = async (
    key: string,
    userId: string,
    length = 6,
    expireAtInHour = 6
): Promise<string | undefined> => {
    const otp = generate(length)
    const REDIS_KEY = `${key}${otp}`
    const result = await RedisUtil.setData(REDIS_KEY, userId, expireAtInHour * 60 * 60)
    if (result) return otp
    return undefined
}

const verifyOtp = async (key: string, otp: string): Promise<string | undefined> => {
    const REDIS_KEY = `${key}${otp}`
    const userIdFromDb = await RedisUtil.getData<string>(REDIS_KEY)
    if (userIdFromDb) {
        // delete the otp now after verification
        await RedisUtil.deleteData(REDIS_KEY)
        return userIdFromDb
    }
    return undefined
}

export const OtpUtils = {
    storeAndGetOtp,
    verifyOtp,
}
