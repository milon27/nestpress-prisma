import { NextFunction, Request, Response } from "express"
import { StatusCode } from "../../../config/constant/code.constant"
import { KeyConstant } from "../../../config/constant/key.constant"
import { AccessTokenUtil } from "../../../utils/access-token.util"
import { CookieUtil } from "../../../utils/cookie.util"
import { MyResponse } from "../../../utils/my-response.util"
import { UnAuthorizedError } from "../../../common/model/error.model"

export const LogoutController = {
    logoutUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const oldRefreshToken = req.refreshToken
            if (!oldRefreshToken) {
                throw new UnAuthorizedError()
            }
            // black list token
            await AccessTokenUtil.blackListToken(oldRefreshToken)
            // do logout
            CookieUtil.clearCookies(res, [KeyConstant.REFRESH_TOKEN_KEY, KeyConstant.ACCESS_TOKEN_KEY])
            return res.status(StatusCode.OK).json(MyResponse("Logged Out!"))
        } catch (error) {
            return next(error)
        }
    },
}
