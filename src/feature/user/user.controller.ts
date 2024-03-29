import { NextFunction, Request, Response } from "express"
import { UnAuthorizedError } from "../../common/model/error.model"
import { StatusCode } from "../../config/constant/code.constant"
import { MyResponse } from "../../utils/my-response.util"
import { UserService } from "./user.service"

export const UserController = {
    getLoggedInUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userWithPass = await UserService.getUserByIdentifier("id", req.user.id)
            if (!userWithPass) {
                throw new UnAuthorizedError()
            }
            const user = UserService.excludePassword(userWithPass, ["password"])
            return res.send(MyResponse("user information", user))
        } catch (error) {
            return next(error)
        }
    },
    deleteUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await UserService.deleteUser("id", req.user.id)
            return res.status(StatusCode.OK).send(MyResponse("user deleted"))
        } catch (error) {
            return next(error)
        }
    },
}
