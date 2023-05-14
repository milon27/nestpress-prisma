import { Router } from "express"
import { HealthCheckController } from "./health-check.controller"

const HealthCheckRouter = Router()

/**
 * @description Check home route
 * @url {{BASE_URL}}/
 */
HealthCheckRouter.get("/", HealthCheckController.getBasicInfo)

/**
 * @description Check db connection
 * @url {{BASE_URL}}/db
 */
HealthCheckRouter.get("/db", HealthCheckController.checkDatabaseConnection)

/**
 * @description Check any prisma related query
 * @url {{BASE_URL}}/prisma
 */
HealthCheckRouter.get("/prisma", HealthCheckController.prismaPerformance)

/**
 * @description Check redis connection
 * @url {{BASE_URL}}/redis
 */
HealthCheckRouter.get("/redis", HealthCheckController.redisConnectionCheck)

/**
 * @description sample route
 * @url {{BASE_URL}}/debug
 */
HealthCheckRouter.get("/debug", HealthCheckController.debug)

export default HealthCheckRouter
