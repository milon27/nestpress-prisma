import { Request, Response } from "express"
import { ErrorCode, StatusCode } from "../../config/constant/code.constant"
import { prismaClient } from "../../config/prisma/prisma.config"
import MyResponse, { MyErrorResponse } from "../../utils/my-response.util"
import { RedisUtil } from "../../utils/redis.util"
import { myLogger } from "../../config/logger"

export const HealthCheckController = {
    getBasicInfo: (req: Request, res: Response) => {
        if (process.env.NODE_ENV) {
            res.send(
                `Running app in ${process.env.NODE_ENV} , https:${req.isHttps}, TZ:${
                    process.env.TZ || "UTC"
                } base url: ${req.myBaseUrl}... 🚀`
            )
        } else {
            res.status(StatusCode.SERVER_ERROR).send("something went wrong")
        }
    },
    checkDatabaseConnection: async (req: Request, res: Response) => {
        try {
            const result = await prismaClient.$queryRaw`select now()`
            res.status(StatusCode.OK).send(MyResponse("db connected", result))
        } catch (e) {
            console.log(e)
            res.status(StatusCode.SERVER_ERROR).send(
                MyErrorResponse(ErrorCode.SERVER_ERROR, `db not connected ${(e as Error).message}`)
            )
        }
    },
    prismaPerformance: async (req: Request, res: Response) => {
        try {
            // const result = await prismaClient.user.findMany() // 35 ms
            const result = await prismaClient.$queryRaw`select * from user` // 30 ms
            res.status(StatusCode.OK).send(MyResponse("findMany: ", result))
        } catch (e) {
            console.log(e)
            res.status(StatusCode.SERVER_ERROR).send(
                MyErrorResponse(ErrorCode.SERVER_ERROR, `findMany ${(e as Error).message}`)
            )
        }
    },
    redisConnectionCheck: async (req: Request, res: Response) => {
        try {
            await RedisUtil.setData("example-test-redis", "redis working", 30)
            const result = await RedisUtil.getData("example-test-redis")
            res.status(StatusCode.OK).send(MyResponse("redis connected", result))
        } catch (e) {
            myLogger().error(e)
            res.status(StatusCode.SERVER_ERROR).send(
                MyErrorResponse(
                    ErrorCode.SERVER_ERROR,
                    (e as Error).message.replace(/[|&;$%@"<>()+,]/g, "").replaceAll("\n", "")
                )
            )
        }
    },
    debug: (req: Request, res: Response) => {
        return res.send({ message: "working fine" })
    },
}
