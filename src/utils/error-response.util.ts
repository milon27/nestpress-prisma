import { Prisma } from "@prisma/client"
import { Response } from "express"
import { ErrorCode, StatusCode } from "../config/constant/code.constant"
import { PrismaErrorCode } from "../config/prisma/prisma-error-code"
import { ServerError } from "../common/model/error.model"
import { MyErrorResponse } from "./my-response.util"

const errorResponse = (
    res: Response,
    e: Prisma.PrismaClientValidationError | Prisma.PrismaClientKnownRequestError | unknown
) => {
    if (e instanceof ServerError) {
        return res.status(e.statusCode).json(MyErrorResponse(e.errorCode, (e as Error).message))
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let message = `${e.message}, Error Code: ${(e as any)?.code}`
        let errorCode = ErrorCode.SERVER_ERROR
        if (e.code.startsWith("P20")) {
            const index = Object.values(PrismaErrorCode).findIndex((item) => item === e.code)
            if (index !== -1) {
                // error is known
                // const errorKey = Object.keys(PrismaErrorCode)[index]
                const errorValue = Object.values(PrismaErrorCode)[index]
                if (errorValue === PrismaErrorCode.UniqueConstraintViolation) {
                    if (e.meta?.target !== "PRIMARY") {
                        message = `${`${e.meta?.target}`
                            .replaceAll("_", " ")
                            .replaceAll("key", "")}is already used!`
                        errorCode = ErrorCode.ALREADY_USED
                    } else {
                        message = `Already created!`
                        errorCode = ErrorCode.ALREADY_CREATED
                    }
                } else if (errorValue === PrismaErrorCode.ForeignConstraintViolation) {
                    message = `Invalid ${e.meta?.field_name}!`
                    errorCode = ErrorCode.BAD_REQUEST
                } else if (errorValue === PrismaErrorCode.RecordsNotFound) {
                    message = `Records Not Found! ${e.meta?.cause}.`
                    errorCode = ErrorCode.NOT_FOUND
                } else if (errorValue === PrismaErrorCode.RelatedRecordNotFound) {
                    message = `Many to many relation values are invalid! ${e.meta?.cause}.`
                    errorCode = ErrorCode.NOT_FOUND
                } else if (errorValue === PrismaErrorCode.ValueTooLongForColumnType) {
                    message = `Too Long Value for ${e.meta?.column_name}.`
                    errorCode = ErrorCode.VALUE_TOO_LONG
                }
            }
            return res.status(StatusCode.BAD_REQUEST).json(MyErrorResponse(errorCode, message))
        }
        return res.status(StatusCode.SERVER_ERROR).json(MyErrorResponse(errorCode, message))
    }
    return res.status(StatusCode.SERVER_ERROR).json(MyErrorResponse(ErrorCode.SERVER_ERROR, (e as Error).message))
}
export default errorResponse
