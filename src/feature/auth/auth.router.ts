import { Router } from "express"
import ForgetPasswordRouter from "./forget-password/forget-password.router"
import LoginRegisterRouter from "./login-register/login-register.router"
import LogoutRouter from "./logout/logout.router"
import TokenRouter from "./token/token.router"
import VerifyEmailRouter from "./verify-email/verify-email.router"

const AuthRouter = Router()

// login-register
AuthRouter.use("/", LoginRegisterRouter)
// logout
AuthRouter.use("/logout", LogoutRouter)
// token
AuthRouter.use("/token", TokenRouter)
// forget password
AuthRouter.use("/forget-password", ForgetPasswordRouter)
// verify-email
AuthRouter.use("/verify-email", VerifyEmailRouter)

export default AuthRouter
