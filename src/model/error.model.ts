/* eslint-disable max-classes-per-file */

import { ErrorCode, StatusCode } from "../config/constant/code.constant"

export class ServerError extends Error {
    statusCode = StatusCode.SERVER_ERROR

    errorCode = ErrorCode.SERVER_ERROR

    constructor(message = "Internal Server Error", code?: number, errorCode?: ErrorCode) {
        super(message)
        if (code) {
            this.statusCode = code
        }
        if (errorCode) {
            this.errorCode = errorCode
        }
        Object.setPrototypeOf(this, ServerError.prototype)
    }
}

export class NotFoundError extends ServerError {
    constructor(message: string) {
        super(message, StatusCode.NOT_FOUND, ErrorCode.NOT_FOUND)
    }
}

export class UnAuthorizedError extends ServerError {
    constructor() {
        super("Authentication failed", StatusCode.UNAUTHORIZED, ErrorCode.UNAUTHORIZED)
    }
}

export class JWTExpiredError extends ServerError {
    constructor() {
        super("token expired", StatusCode.UNAUTHORIZED, ErrorCode.TOKEN_EXPIRED)
    }
}

export class ForbiddenError extends ServerError {
    constructor(message: string) {
        super(message, StatusCode.FORBIDDEN, ErrorCode.FORBIDDEN)
    }
}

export class BadRequestError extends ServerError {
    constructor(message: string, errorCode: ErrorCode = ErrorCode.BAD_REQUEST) {
        super(message, StatusCode.BAD_REQUEST, errorCode)
    }
}
