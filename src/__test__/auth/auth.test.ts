import supertest from "supertest"
import { beforeAll, describe, expect, it } from "vitest"
import app from "../../app"
import { StatusCode } from "../../config/constant/code.constant"
import { KeyConstant } from "../../config/constant/key.constant"
import { myLogger } from "../../config/logger"
import { UserService } from "../../feature/user/user.service"
import { createSampleUserPayload, loginUserPayload } from "../data"

describe("/auth", () => {
    let accessToken = ""
    let refreshToken = ""

    beforeAll(async () => {
        myLogger().info("====================== STARTING AUTH.TEST.TS ======================")
        await UserService.deleteUser("email", createSampleUserPayload.user.email)
    })

    describe("register a user", () => {
        it("given invalid user payload", async () => {
            const { statusCode } = await supertest(app).post("/v1/auth/register").send({})
            expect(statusCode).toBe(StatusCode.BAD_REQUEST)
        })
        it("given valid user payload", async () => {
            const { statusCode, body } = await supertest(app)
                .post("/v1/auth/register")
                .send(createSampleUserPayload)
            expect(statusCode).toBe(StatusCode.OK)
            expect(body.response.accessToken).toBeDefined()
            expect(body.response.refreshToken).toBeDefined()
        })
    })
    describe("login a user", () => {
        it("given valid user payload", async () => {
            const { statusCode, body } = await supertest(app)
                .post("/v1/auth/login-with-email")
                .send(loginUserPayload)
            expect(statusCode).toBe(StatusCode.OK)
            expect(body.response.accessToken).toBeDefined()
            expect(body.response.refreshToken).toBeDefined()
            accessToken = body.response.accessToken
            refreshToken = body.response.refreshToken
        })
    })
    describe("get logged in user", () => {
        it("when user is logged in", async () => {
            const { statusCode, body } = await supertest(app)
                .post("/v1/user")
                .set("Cookie", `${KeyConstant.ACCESS_TOKEN_KEY}=${accessToken}`)

            expect(statusCode).toBe(StatusCode.OK)
            expect(body.response).toBeDefined()
            expect(body.response.id).toBeDefined()
        })
        it("when user is not logged in", async () => {
            const { statusCode } = await supertest(app)
                .post("/v1/user")
                .set("Cookie", `${KeyConstant.ACCESS_TOKEN_KEY}=INVALID_KEY`)

            expect(statusCode).toBe(StatusCode.UNAUTHORIZED)
        })
    })
    describe("logout user", () => {
        it("pass refresh token", async () => {
            const { statusCode } = await supertest(app)
                .post("/v1/auth/logout")
                .set("Cookie", `${KeyConstant.REFRESH_TOKEN_KEY}=${refreshToken}`)

            expect(statusCode).toBe(StatusCode.OK)
        })
    })
    describe.todo("verify email")
    describe.todo("forget password")
    // todo: if not verified user can't login
    // todo: already verified user can't ask for otp again
    // todo: in some case if user email is not verified , he can't ask for reset password
})
