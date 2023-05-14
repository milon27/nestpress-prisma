import { Router } from "express"
import { AuthMid } from "../../../middleware/auth.mid"
import { LogoutController } from "./logout.controller"

const LogoutRouter = Router()

/**
 * @description logout user
 * @note un logged in user/access token expired user can also login if they have valid refresh token
 * @url {{BASE_URL}}/auth/logout
 */
LogoutRouter.post("/", AuthMid.attachToken, LogoutController.logoutUser)

export default LogoutRouter
