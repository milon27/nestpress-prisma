import { UserService } from "../feature/user/user.service"
import { AccessTokenUtil } from "../utils/access-token.util"

// auth
export const loginUserPayload = {
    email: "test@g.com",
    password: "1234567",
}
export const createUserPayload = {
    provider: "simple",
    user: {
        ...loginUserPayload,
        fullName: "milon27",
        gender: "male",
    },
}
export const createSampleUserPayload = {
    provider: "simple",
    user: {
        email: "sample@g.com",
        password: "1234567",
        fullName: "sample",
        gender: "male",
    },
}

export const loginUser = async () => {
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
