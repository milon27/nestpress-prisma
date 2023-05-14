import { NextFunction, Request, Response } from "express"
import { StatusCode } from "../../../config/constant/code.constant"
import { Constant } from "../../../config/constant/common.constant"
import { NotFoundError } from "../../../model/error.model"
import MyResponse from "../../../utils/my-response.util"
import { UserService } from "../../user/user.service"
import { ILoginWithEmailDto, ILoginWithGoogleDto } from "./dto/login.dto"
import { IRegisterDto, RegisterProvider } from "./dto/register.dto"
import { LoginRegisterService } from "./login-register.service"

export const LoginRegisterController = {
    loginWithEmail: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body as ILoginWithEmailDto

            // check user is available or not in db
            const user = await UserService.validateUser(email, password)
            if (!user) {
                throw new NotFoundError(`No User Found with ${email}`)
            }
            return LoginRegisterService.sendTokenResponse(req, res, user, "")
        } catch (e) {
            return next(e)
        }
    },
    loginRegisterWithGoogle: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { idToken } = req.body as ILoginWithGoogleDto

            // check user is available or not in db
            const email = await LoginRegisterService.verifyGoogleIdToken(idToken)
            const user = await UserService.validateUser(email, Constant.DEFAULT_PASSWORD)
            if (!user) {
                // tell them to send to complete profile screen
                return res
                    .status(StatusCode.OK)
                    .send(MyResponse("Google Authentication successful, complete the user profile and signup!"))
            }
            return LoginRegisterService.sendTokenResponse(req, res, user, "user logged-in successfully")
        } catch (e) {
            return next(e)
        }
    },
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as IRegisterDto
            const user = await UserService.createUser(body.user, body.provider === RegisterProvider.google)

            return LoginRegisterService.sendTokenResponse(req, res, user, "user registered successfully")
        } catch (e) {
            return next(e)
        }
    },
}
