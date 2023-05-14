import { addSeconds } from "date-fns"
import jwt from "jsonwebtoken"
import { createId } from "@paralleldrive/cuid2"
import { KeyConstant } from "../config/constant/key.constant"
import { myLogger } from "../config/logger"
import { ICurrentUser } from "../model/current-user.model"
import { JWTExpiredError, UnAuthorizedError } from "../model/error.model"
import { RedisUtil } from "./redis.util"

export const AccessTokenUtil = {
    /**
     * @param payload
     * @returns accessToken, refreshToken
     */
    generateTokens: (payload: ICurrentUser) => {
        const accessToken = jwt.sign({ at_random: createId(), ...payload }, `${process.env.JWT_SECRET}`, {
            issuer: process.env.JWT_ISSUER,
            expiresIn: `${process.env.JWT_AT_EXPIRE}`,
        })
        const refreshToken = jwt.sign({ rt_random: createId(), ...payload }, `${process.env.JWT_SECRET}`, {
            issuer: process.env.JWT_ISSUER,
            expiresIn: `${process.env.JWT_RT_EXPIRE}`,
        })
        return { accessToken, refreshToken }
    },
    verifyToken: (token?: string): ICurrentUser => {
        try {
            if (!token) {
                throw new UnAuthorizedError()
            }
            const payload = jwt.verify(token, `${process.env.JWT_SECRET}`) as ICurrentUser
            if (!payload) {
                throw new UnAuthorizedError()
            }
            return { id: payload.id } as ICurrentUser
        } catch (e) {
            if (token && e instanceof jwt.TokenExpiredError) {
                throw new JWTExpiredError()
            }
            throw new UnAuthorizedError()
        }
    },
    decodeToken: (token?: string) => {
        if (!token) {
            return undefined
        }
        const payload = jwt.decode(token) as jwt.JwtPayload | undefined
        return payload
    },
    blackListToken: async (token?: string) => {
        const payload = AccessTokenUtil.decodeToken(token)
        if (payload && payload.exp) {
            const expiresInSeconds = payload.exp - Math.floor(Date.now() / 1000) // calculate time until expiration in seconds
            if (expiresInSeconds > 0) {
                // storing on black list if already not expired
                const message = `expire at ${addSeconds(new Date(), expiresInSeconds).toString()}`
                await RedisUtil.setData(KeyConstant.BLACK_LIST_PREFIX + token, message, expiresInSeconds)
            }
        } else {
            myLogger().info("already expired token")
        }
    },
    ckIsBlackListToken: async (token?: string) => {
        const blackListedToken = await RedisUtil.getData<string>(KeyConstant.BLACK_LIST_PREFIX + token)
        if (blackListedToken) {
            return true
        }
        return false
    },
}
