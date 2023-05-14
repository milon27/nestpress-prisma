import { Router } from "express"
import { UserController } from "./user.controller"
import { AuthMid } from "../../middleware/auth.mid"

const UserRouter = Router()

UserRouter.use(AuthMid.isLoggedInMid)

/**
 * @description get logged in user
 * @url {{BASE_URL}}/user
 */
UserRouter.post("/", UserController.getLoggedInUser)

/**
 * @description delete a user
 * @url {{BASE_URL}}/user/:id
 */
UserRouter.delete("/:id", UserController.deleteUser)

export default UserRouter
