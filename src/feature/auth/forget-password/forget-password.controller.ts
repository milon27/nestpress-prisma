import { NextFunction, Request, Response } from "express"
import { StatusCode } from "../../../config/constant/code.constant"
import { KeyConstant } from "../../../config/constant/key.constant"
import { BadRequestError, NotFoundError, ServerError } from "../../../model/error.model"
import { SendResetPasswordEmail } from "../../../utils/email/send-email.util"
import MyResponse from "../../../utils/my-response.util"
import { OtpUtils } from "../../../utils/otp.util"
import { UserService } from "../../user/user.service"
import { IEmailParamDto, IResetPasswordDto } from "./dto/forget-password.dto"

export const ForgetPasswordController = {
    getResetOtp: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.params as IEmailParamDto

            const user = await UserService.getUserByIdentifier("email", email)
            if (!user) {
                throw new NotFoundError("no user found!")
            }
            // todo: only verified user can ask for reset password to ignore spam
            // if (!user.isEmailVerified) {
            //     throw new BadRequestError("user's email already verified")
            // }

            const code = await OtpUtils.storeAndGetOtp(KeyConstant.PASS_OTP_PREFIX, user.id, 12)
            if (!code) {
                throw new ServerError()
            }
            const resetLink = `${process.env.BASE_CLIENT_URL}/forget-password?token=${code}`
            await SendResetPasswordEmail(user.fullName, user.email, resetLink)
            return res.status(StatusCode.OK).json(MyResponse(`reset password link sent to ${user.email}`))
        } catch (e) {
            return next(e)
        }
    },
    verifyOtpAndUpdatePassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { code, password } = req.body as IResetPasswordDto

            const userId = await OtpUtils.verifyOtp(KeyConstant.PASS_OTP_PREFIX, code)
            if (!userId) {
                throw new BadRequestError("invalid code")
            }
            await UserService.updateUser(userId, {
                password,
            })
            return res.status(StatusCode.OK).json(MyResponse("Reset Password successfully"))
        } catch (e) {
            return next(e)
        }
    },
}
