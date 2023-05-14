import { Router } from "express"
import { UserController } from "./user.controller"
import { AuthMid } from "../../middleware/auth.mid"

const UserRouter = Router()

UserRouter.use(AuthMid.isLoggedInMid)

/**
 * @description get logged in user
 * @post http://localhost:4000/v1/user
 */
UserRouter.post("/", UserController.getLoggedInUser)

/**
 * @description delete a user
 * @post http://localhost:4000/v1/user/:id
 */
UserRouter.delete("/:id", UserController.deleteUser)

export default UserRouter
