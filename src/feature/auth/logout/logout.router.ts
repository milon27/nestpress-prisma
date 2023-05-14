import { Router } from "express"
import { AuthMid } from "../../../middleware/auth.mid"
import { LogoutController } from "./logout.controller"

const LogoutRouter = Router()

// todo: should be logged in user
/**
 * @description logout user
 * @url http://localhost:4000/v1/auth/logout
 */
LogoutRouter.post("/", AuthMid.attachToken, LogoutController.logoutUser)

export default LogoutRouter
