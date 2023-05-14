import { Response, Request, NextFunction } from "express"
import { myLogger } from "../config/logger"

export const loggerMid = (req: Request, res: Response, next: NextFunction) => {
    myLogger().info(`[REQ URL]= ${req.url}`)
    next()
}
