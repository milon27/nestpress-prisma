import { NextFunction, Request, Response } from "express"
import { StatusCode } from "../../../config/constant/code.constant"
import { KeyConstant } from "../../../config/constant/key.constant"
import { UnAuthorizedError } from "../../../common/model/error.model"
import { AccessTokenUtil } from "../../../utils/access-token.util"
import { CookieUtil } from "../../../utils/cookie.util"
import { MyResponse } from "../../../utils/my-response.util"

export const TokenController = {
    generateNewTokens: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // * get the oldTokens form cookie or auth header
            const oldRefreshToken = req.refreshToken
            const oldAccessToken = req.accessToken
            if (!oldRefreshToken || !oldAccessToken) {
                throw new UnAuthorizedError()
            }
            const payload = AccessTokenUtil.verifyToken(oldRefreshToken)
            // * check if the token in on black list
            const isBlackListedToken = await AccessTokenUtil.ckIsBlackListToken(oldRefreshToken)

            if (isBlackListedToken === true) {
                throw new UnAuthorizedError()
            }
            // * black list old token
            await AccessTokenUtil.blackListToken(oldRefreshToken)

            const { accessToken, refreshToken } = AccessTokenUtil.generateTokens(payload)

            CookieUtil.setHttpCookie(req, res, KeyConstant.ACCESS_TOKEN_KEY, accessToken)
            CookieUtil.setHttpCookie(req, res, KeyConstant.REFRESH_TOKEN_KEY, refreshToken)
            return res
                .status(StatusCode.OK)
                .json(MyResponse("New tokens generated", { accessToken, refreshToken }))
        } catch (error) {
            return next(error)
        }
    },
}
