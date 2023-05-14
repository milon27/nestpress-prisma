import { NextFunction, Request, Response } from "express"
import { KeyConstant } from "../config/constant/key.constant"
import { AccessTokenUtil } from "../utils/access-token.util"

const isLoggedInMid = (req: Request, res: Response, next: NextFunction) => {
    try {
        // todo: const authHead = req.agent === "android" ? req.headers.authorization : undefined
        const authHead = req.headers.authorization
        const token: string | undefined =
            req.cookies[KeyConstant.ACCESS_TOKEN_KEY] || (authHead && authHead.split(" ")[1])

        const refreshToken: string | undefined = req.cookies[KeyConstant.REFRESH_TOKEN_KEY]

        // token validation
        const user = AccessTokenUtil.verifyToken(token)
        req.accessToken = token
        req.refreshToken = refreshToken
        req.user = user

        next()
    } catch (e) {
        // res.status(StatusCode.UNAUTHORIZED).json(MyErrorResponse(ErrorCode.UNAUTHORIZED, (e as Error).message))
        next(e)
    }
}

const attachToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        // todo: const authHead = req.agent === "android" ? req.headers.authorization : undefined
        const authHead = req.headers.authorization
        const token: string | undefined =
            req.cookies[KeyConstant.ACCESS_TOKEN_KEY] || (authHead && authHead.split(" ")[1])

        const refreshToken: string | undefined = req.cookies[KeyConstant.REFRESH_TOKEN_KEY]

        // token validation
        req.accessToken = token
        req.refreshToken = refreshToken

        next()
    } catch (e) {
        next(e)
    }
}

// const isAdminMid = (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { user } = req
//         if (user.role.slug === Constant.ADMIN_ROLE) {
//             next()
//         } else {
//             throw new ForbiddenError(
//                 "You are not authorized to perform this action. Only users with the 'admin' role can perform this action."
//             )
//         }
//     } catch (e) {
//         res.status(StatusCode.FORBIDDEN).json(
//             MyErrorResponse(ErrorCode.FORBIDDEN, (e as Error).message)
//         )
//     }
// }

export const AuthMid = {
    isLoggedInMid,
    attachToken,
    isAdminMid: [isLoggedInMid],
}
