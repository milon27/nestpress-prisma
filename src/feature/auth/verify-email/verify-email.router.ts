import { Router } from "express"
import { validateMid } from "../../../middleware/validate.mid"
import { VerifyEmailDto } from "./dto/verify-email.dto"
import { VerifyEmailController } from "./verify-email.controller"
import { emailLimiter } from "../../../middleware/limiter/email.limiter"
import { KeyConstant } from "../../../config/constant/key.constant"

const VerifyEmailRouter = Router()

/**
 * @description get verify email with link/otp
 * @url http://localhost:4000/v1/auth/verify-email/:email
 */
VerifyEmailRouter.get("/:email", emailLimiter(KeyConstant.RL_EMAIL_VERIFY_MAX), VerifyEmailController.getOtp)

/**
 * @description verify email
 * @url http://localhost:4000/v1/auth/verify-email
 */
VerifyEmailRouter.post("/", validateMid(VerifyEmailDto), VerifyEmailController.verifyEmail)

export default VerifyEmailRouter
