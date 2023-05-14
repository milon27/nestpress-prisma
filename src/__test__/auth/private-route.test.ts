import supertest from "supertest"
import { beforeAll, describe, expect, it } from "vitest"
import app from "../../app"
import { StatusCode } from "../../config/constant/code.constant"
import { KeyConstant } from "../../config/constant/key.constant"
import { myLogger } from "../../config/logger"
import { loginUser } from "../data"

let AT: string | undefined
let RT: string | undefined
// do other task
describe("use access token in another file", () => {
    beforeAll(async () => {
        myLogger().info("====================== PRIVATE-ROUTE.TEST.TS ======================")
        const { accessToken, refreshToken } = await loginUser()
        AT = accessToken
        RT = refreshToken
    })

    it("when user is logged in", async () => {
        expect(AT).toBeDefined()
        expect(RT).toBeDefined()
        const { statusCode, body } = await supertest(app)
            .post("/v1/user")
            .set("Cookie", `${KeyConstant.ACCESS_TOKEN_KEY}=${AT}`)

        expect(statusCode).toBe(StatusCode.OK)
        expect(body.response).toBeDefined()
        expect(body.response.id).toBeDefined()
    })
})
