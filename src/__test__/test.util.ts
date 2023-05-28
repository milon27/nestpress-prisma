import { UserService } from "../feature/user/user.service"
import { AccessTokenUtil } from "../utils/access-token.util"
import { RedisUtil } from "../utils/redis.util"
import { loginUserPayload, createUserPayload } from "./data"

// create a user and get tokens
const createUser = async () => {
    const user = await UserService.getUserByIdentifier("email", loginUserPayload.email)
    if (user) {
        return AccessTokenUtil.generateTokens({ id: user.id })
    }
    const newUser = await UserService.createUser({
        ...createUserPayload.user,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    return AccessTokenUtil.generateTokens({ id: newUser.id })
}

// clean db + clean redis
const cleanDbAndRedis = async () => {
    await UserService.deleteUser("email", loginUserPayload.email)
    await RedisUtil.clear()
}

export const TestUtil = {
    createUser,
    cleanDbAndRedis,
}
