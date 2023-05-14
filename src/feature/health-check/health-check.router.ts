import { Router } from "express"
import { HealthCheckController } from "./health-check.controller"

const HealthCheckRouter = Router()

/**
 * @description Check home route
 * @url http://localhost:4000/v1/
 */
HealthCheckRouter.get("/", HealthCheckController.getBasicInfo)

/**
 * @description Check home route
 * @url http://localhost:4000/v1/db
 */
HealthCheckRouter.get("/db", HealthCheckController.checkDatabaseConnection)

/**
 * @description Check home route
 * @url http://localhost:4000/v1/prisma
 */
HealthCheckRouter.get("/prisma", HealthCheckController.prismaPerformance)

/**
 * @description Check redis route
 * @url http://localhost:4000/v1/redis
 */
HealthCheckRouter.get("/redis", HealthCheckController.redisConnectionCheck)

/**
 * @description Check home route
 * @url http://localhost:4000/v1/debug
 */
HealthCheckRouter.get("/debug", HealthCheckController.debug)

export default HealthCheckRouter
