import { Router } from "express"
import { AuthMid } from "../../../middleware/auth.mid"
import { TokenController } from "./token.controller"
import { refreshTokenLimiter } from "../../../middleware/limiter/refresh-token.limiter"

const TokenRouter = Router()

/**
 * @description access token + refresh token
 * @url {{BASE_URL}}/auth/token
 */
TokenRouter.post("/", AuthMid.attachToken, refreshTokenLimiter, TokenController.generateNewTokens)

export default TokenRouter
