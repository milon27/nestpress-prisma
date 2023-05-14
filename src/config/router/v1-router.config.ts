import express from "express"
import HealthCheckRouter from "../../feature/health-check/health-check.router"
import AuthRouter from "../../feature/auth/auth.router"
import UserRouter from "../../feature/user/user.router"

const v1Router = express.Router()

v1Router.use(`/`, HealthCheckRouter)
v1Router.use(`/auth`, AuthRouter)
v1Router.use(`/user`, UserRouter)

export default v1Router
