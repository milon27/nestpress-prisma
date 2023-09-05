import { User } from "@prisma/client"
import { Request, Response } from "express"
import { OAuth2Client, TokenPayload } from "google-auth-library"
import { ICurrentUser, IUserJWT } from "../../../common/model/current-user.model"
import { StatusCode } from "../../../config/constant/code.constant"
import { KeyConstant } from "../../../config/constant/key.constant"
import { myLogger } from "../../../config/logger"
import { AccessTokenUtil } from "../../../utils/access-token.util"
import { CookieUtil } from "../../../utils/cookie.util"
import { MyResponse } from "../../../utils/my-response.util"

const client = new OAuth2Client()

const CLIENT_IDS = [
    `${process.env.GOOGLE_WEB_CLIENT_ID}`,
    `${process.env.GOOGLE_ANDROID_CLIENT_ID}`,
    `${process.env.GOOGLE_IOS_CLIENT_ID}`,
]

export const LoginRegisterService = {
    /**
     * doc: https://developers.google.com/identity/one-tap/android/idtoken-auth
     * @param idToken
     * @returns email
     */
    verifyGoogleIdToken: async (idToken: string) => {
        try {
            const ticket = await client.verifyIdToken({
                idToken,
                requiredAudience: CLIENT_IDS, // [CLIENT_ID1,CLIENT_ID2]
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any)
            const payload: TokenPayload | undefined = ticket.getPayload()

            if (
                payload &&
                payload.email &&
                payload.iss === "https://accounts.google.com" &&
                CLIENT_IDS.includes(payload?.aud)
            ) {
                return payload.email
            }
            throw new Error("Invalid ID Token")
        } catch (error) {
            myLogger().error(`verifyGoogleIdToken error: ${(error as Error).message}`)
            throw new Error("Invalid ID token")
        }
    },

    sendTokenResponse: (req: Request, res: Response, user: Omit<User, "password">, message: string) => {
        // get token and set into cookie
        const payload = { id: user.id } as IUserJWT
        const userPayload = { ...user } as ICurrentUser
        const { accessToken, refreshToken } = AccessTokenUtil.generateTokens(payload)

        CookieUtil.setHttpCookie(req, res, KeyConstant.ACCESS_TOKEN_KEY, accessToken)
        CookieUtil.setHttpCookie(req, res, KeyConstant.REFRESH_TOKEN_KEY, refreshToken)
        return res.status(StatusCode.OK).json(MyResponse(message, { ...userPayload, accessToken, refreshToken }))
    },
}
