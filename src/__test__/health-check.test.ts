import { describe, expect, it } from "vitest"
import supertest from "supertest"
import app from "../app"

describe("health-check", () => {
    describe("check root route", () => {
        it("should return text with env values", async () => {
            const result = await supertest(app).get("/v1")
            expect(result.text).contain(
                "Running app in test , https:false, TZ:Etc/UTC base url: http://localhost:4000/v1"
            )
        })
    })
    describe("check database connection", () => {
        it("should return response", async () => {
            const result = await supertest(app).get("/v1/db")
            expect(result.body.response).toBeDefined()
        })
    })
    describe("check redis connection", () => {
        it("should return response", async () => {
            const result = await supertest(app).get("/v1/redis")
            expect(result.body.response).toBeDefined()
        })
    })
})
