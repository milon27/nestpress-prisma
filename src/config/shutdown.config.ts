import { Server } from "http"
import { prismaClient } from "./prisma/prisma.config"
import { myLogger } from "./logger"

export const shutdownServer = (server: Server) => {
    prismaClient.$on("beforeExit", () => {
        server.close(() => {
            myLogger().info("database connection lost, server closed")
        })
    })
    process.on("SIGTERM", () => {
        server.close(() => {
            myLogger().info("server closed by signal")
        })
    })
    const unexpectedErrorHandler = (error: Error) => {
        myLogger().error(error)
        server.close(() => {
            myLogger().info("unexpectedErrorHandler : Server closed")
            process.exit(1)
        })
    }

    process.on("uncaughtException", unexpectedErrorHandler)
    process.on("unhandledRejection", unexpectedErrorHandler)
}
