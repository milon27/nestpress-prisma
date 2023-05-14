import { NextFunction, Request, Response } from "express"
import { ObjectSchema } from "joi"
import { ErrorCode, StatusCode } from "../config/constant/code.constant"
import { MyErrorResponse } from "../utils/my-response.util"

export const validateMid = <T>(schema: ObjectSchema<T>) => {
    // eslint-disable-next-line consistent-return
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await schema.validateAsync(req.body, {
                abortEarly: false,
            })
            req.body = data
            next()
        } catch (errors) {
            let err: { key: string; message: string }[] | string
            if (errors) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                err = ((errors as any).details as Array<any>).map((item) => {
                    const key = item.path.toString().replaceAll(",", ".")
                    return {
                        key,
                        // eslint-disable-next-line no-useless-escape
                        message: item.message.replaceAll(`\"${key}\"`, `${key} field`),
                    }
                })
            } else {
                err = "Invalid Request Body!"
            }
            return res.status(StatusCode.BAD_REQUEST).send(MyErrorResponse(ErrorCode.BAD_REQUEST, err))
        }
    }
}
