import { Router } from "express"
import { AuthMid } from "../../../middleware/auth.mid"
import { TokenController } from "./token.controller"
import { refreshTokenLimiter } from "../../../middleware/limiter/refresh-token.limiter"

const TokenRouter = Router()

/**
 * @description access token + refresh token
 * @url http://localhost:4000/v1/auth/token
 */
TokenRouter.post("/", AuthMid.attachToken, refreshTokenLimiter, TokenController.generateNewTokens)

export default TokenRouter
