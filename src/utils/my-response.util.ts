import { ZodFormattedError } from "zod"
import { ErrorCode, StatusCode } from "../config/constant/code.constant"

// eslint-disable-next-line @typescript-eslint/default-param-last
export const MyResponse = <T>(message: string, response?: T, statusCode = StatusCode.OK) => {
    // msd
    // message status data
    return {
        message,
        statusCode,
        response,
    }
}

export const MyErrorResponse = (
    errorCode = ErrorCode.SERVER_ERROR,
    message?:
        | string
        | ZodFormattedError<
              {
                  [x: string]: unknown
              },
              string
          >
) => {
    return {
        errorCode,
        message,
    }
}
