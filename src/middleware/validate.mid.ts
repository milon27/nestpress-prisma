import { NextFunction, Request, Response } from "express"
import { z, AnyZodObject } from "zod"
import { ErrorCode, StatusCode } from "../config/constant/code.constant"
import { MyErrorResponse } from "../utils/my-response.util"

export const validateMid = ({
    body,
    params,
    query,
}: {
    body?: AnyZodObject
    params?: AnyZodObject
    query?: AnyZodObject
}) => {
    const schema = z.object({
        body: body ? body.strict() : z.object({}),
        params: params ? params.strict() : z.object({}),
        query: query ? query.strict() : z.object({}),
    }) as AnyZodObject
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const reqObjCk = schema.safeParse({
                body: req.body,
                query: req.query,
                params: req.params,
            })
            if (reqObjCk.success) {
                req.query = reqObjCk.data.query
                req.body = reqObjCk.data.body
                req.params = reqObjCk.data.params
                return next()
            }
            return res
                .status(StatusCode.BAD_REQUEST)
                .send(MyErrorResponse(ErrorCode.BAD_REQUEST, reqObjCk.error.format()))
        } catch (err) {
            return res
                .status(StatusCode.BAD_REQUEST)
                .send(MyErrorResponse(ErrorCode.BAD_REQUEST, "Invalid Request Body!"))
        }
    }
}
