import { Router } from "express"
import { validateMid } from "../../../middleware/validate.mid"
import { LoginWithEmailDto, LoginWithGoogleDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"
import { LoginRegisterController } from "./login-register.controller"

const LoginRegisterRouter = Router()

/**
 * @description login with email
 * @url {{BASE_URL}}/auth/login-with-email
 */
LoginRegisterRouter.post(
    "/login-with-email",
    validateMid(LoginWithEmailDto),
    LoginRegisterController.loginWithEmail
)

/**
 * @description login with email
 * @url {{BASE_URL}}/auth/login-with-google
 */
LoginRegisterRouter.post(
    "/login-with-google",
    validateMid(LoginWithGoogleDto),
    LoginRegisterController.loginRegisterWithGoogle
)

/**
 * @description register a user
 * @url {{BASE_URL}}/auth/register
 */
LoginRegisterRouter.post("/register", validateMid(RegisterDto), LoginRegisterController.register)

export default LoginRegisterRouter
