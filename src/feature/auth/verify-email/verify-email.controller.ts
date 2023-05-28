import { NextFunction, Request, Response } from "express"
import { StatusCode } from "../../../config/constant/code.constant"
import { KeyConstant } from "../../../config/constant/key.constant"
import { BadRequestError, ServerError, UnAuthorizedError } from "../../../model/error.model"
import { SendEmailVerificationCode } from "../../../utils/email/send-email.util"
import MyResponse from "../../../utils/my-response.util"
import { OtpUtils } from "../../../utils/otp.util"
import { UserService } from "../../user/user.service"
import { IVerifyEmailDto } from "./dto/verify-email.dto"
import { IEmailParamDto } from "../forget-password/dto/forget-password.dto"

export const VerifyEmailController = {
    getOtp: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.params as IEmailParamDto

            const user = await UserService.getUserByIdentifier("email", email)
            if (!user) {
                throw new UnAuthorizedError()
            }
            if (user.isEmailVerified) {
                throw new BadRequestError("user's email already verified")
            }

            const code = await OtpUtils.storeAndGetOtp(KeyConstant.EMAIL_OTP_PREFIX, user.id)
            if (!code) {
                throw new ServerError()
            }
            await SendEmailVerificationCode(user.fullName, user.email, code)
            return res.status(StatusCode.OK).json(MyResponse(`OTP code sent to ${user.email}`))
        } catch (e) {
            return next(e)
        }
    },
    verifyEmail: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { code } = req.body as IVerifyEmailDto

            const userId = await OtpUtils.verifyOtp(KeyConstant.EMAIL_OTP_PREFIX, code)
            if (!userId) {
                throw new BadRequestError("invalid otp")
            }
            await UserService.updateUser(userId, {
                isEmailVerified: true,
            })
            return res.status(StatusCode.OK).json(MyResponse("Email verification successful"))
        } catch (e) {
            return next(e)
        }
    },
}
