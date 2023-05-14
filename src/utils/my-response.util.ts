import { StatusCode, ErrorCode } from "../config/constant/code.constant"

// eslint-disable-next-line @typescript-eslint/default-param-last
const MyResponse = <T>(message: string, response?: T, statusCode = StatusCode.OK) => {
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
    message?: string | { key: string; message: string }[]
) => {
    // mse
    // message status error-obj
    return {
        errorCode,
        message,
    }
}

export default MyResponse
