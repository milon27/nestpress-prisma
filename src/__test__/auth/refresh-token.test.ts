import supertest from "supertest"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"
import app from "../../app"
import { StatusCode } from "../../config/constant/code.constant"
import { KeyConstant } from "../../config/constant/key.constant"
import { myLogger } from "../../config/logger"
import { RedisUtil } from "../../utils/redis.util"
import { TestUtil } from "../test.util"

describe("generate new refresh+access token", () => {
    let AT: string
    let RT: string
    let oldRefreshToken: string

    beforeAll(async () => {
        await TestUtil.cleanDbAndRedis()
        const { accessToken, refreshToken } = await TestUtil.createUser()
        AT = accessToken
        RT = refreshToken
    })
    afterAll(async () => {
        await TestUtil.cleanDbAndRedis()
    })

    beforeEach(() => {
        myLogger().info("--> Clear the Redis for only rate limit for getting refresh token before each test")
        RedisUtil.deleteByPattern(`${KeyConstant.RL_RT_MAX}*`)
    })

    it("need to pass both access token, refresh token", async () => {
        const { statusCode, body } = await supertest(app)
            .post("/v1/auth/token")
            .set("Cookie", [`${KeyConstant.ACCESS_TOKEN_KEY}=${AT}`, `${KeyConstant.REFRESH_TOKEN_KEY}=${RT}`])

        expect(statusCode).toBe(StatusCode.OK)
        expect(body.response.accessToken).toBeDefined()
        expect(body.response.refreshToken).toBeDefined()
        oldRefreshToken = RT
        AT = body.response.accessToken
        RT = body.response.refreshToken
    })

    it("when pass old refresh token", async () => {
        const { statusCode } = await supertest(app)
            .post("/v1/auth/token")
            .set("Cookie", [
                `${KeyConstant.ACCESS_TOKEN_KEY}=${AT}`,
                `${KeyConstant.REFRESH_TOKEN_KEY}=${oldRefreshToken}`,
            ])
        expect(statusCode).toBe(StatusCode.UNAUTHORIZED)
    })

    it("when hit 4 times 3 should be valid, 4th one rate limited", async () => {
        const { statusCode, body } = await supertest(app)
            .post("/v1/auth/token")
            .set("Cookie", [`${KeyConstant.ACCESS_TOKEN_KEY}=${AT}`, `${KeyConstant.REFRESH_TOKEN_KEY}=${RT}`])

        const { statusCode: two, body: bodyTwo } = await supertest(app)
            .post("/v1/auth/token")
            .set("Cookie", [
                `${KeyConstant.ACCESS_TOKEN_KEY}=${body.response.accessToken}`,
                `${KeyConstant.REFRESH_TOKEN_KEY}=${body.response.refreshToken}`,
            ])

        const { statusCode: three, body: bodyThree } = await supertest(app)
            .post("/v1/auth/token")
            .set("Cookie", [
                `${KeyConstant.ACCESS_TOKEN_KEY}=${bodyTwo.response.accessToken}`,
                `${KeyConstant.REFRESH_TOKEN_KEY}=${bodyTwo.response.refreshToken}`,
            ])

        const { statusCode: four } = await supertest(app)
            .post("/v1/auth/token")
            .set("Cookie", [
                `${KeyConstant.ACCESS_TOKEN_KEY}=${bodyThree.response.accessToken}`,
                `${KeyConstant.REFRESH_TOKEN_KEY}=${bodyThree.response.refreshToken}`,
            ])

        AT = bodyThree.response.accessToken
        RT = bodyThree.response.refreshToken

        expect(statusCode).toBe(StatusCode.OK)
        expect(two).toBe(StatusCode.OK)
        expect(three).toBe(StatusCode.OK)
        expect(four).toBe(StatusCode.TOO_MANY_REQUEST)
    })
})
