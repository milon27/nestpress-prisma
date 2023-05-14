import { ErrorRequestHandler, NextFunction, Request, Response } from "express"
import { ErrorCode, StatusCode } from "../config/constant/code.constant"
import { myLogger } from "../config/logger"
import errorResponse from "../utils/error-response.util"
import { MyErrorResponse } from "../utils/my-response.util"

export const notFoundMid = (_req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(StatusCode.NOT_FOUND).send(MyErrorResponse(ErrorCode.NOT_FOUND, `Route not found`))
    } catch (error) {
        next()
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorMid = (err: ErrorRequestHandler, _req: Request, res: Response, _next: NextFunction) => {
    myLogger().error(err)
    return errorResponse(res, err)
}
