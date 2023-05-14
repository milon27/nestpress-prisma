import { Router } from "express"
import { ForgetPasswordController } from "./forget-password.controller"
import { validateMid } from "../../../middleware/validate.mid"
import { ForgetPasswordDto } from "./dto/forget-password.dto"
import { KeyConstant } from "../../../config/constant/key.constant"
import { emailLimiter } from "../../../middleware/limiter/email.limiter"

const ForgetPasswordRouter = Router()

/**
 * @description get reset password link
 * @url http://localhost:4000/v1/auth/forget-password/:email
 */
ForgetPasswordRouter.get(
    "/:email",
    emailLimiter(KeyConstant.RL_RESET_PASS_MAX),
    ForgetPasswordController.getResetOtp
)

/**
 * @description reset password
 * @url http://localhost:4000/v1/auth/forget-password
 */
ForgetPasswordRouter.post("/", validateMid(ForgetPasswordDto), ForgetPasswordController.verifyOtpAndUpdatePassword)

export default ForgetPasswordRouter
