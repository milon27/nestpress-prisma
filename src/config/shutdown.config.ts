import { Server } from "http"
import { prismaClient } from "./prisma/prisma.config"
import { myLogger } from "./logger"

export const shutdownServer = (server: Server) => {
    const downServerGracefully = (message = "server closed by signal") => {
        server.close(async () => {
            myLogger().info(message)
            await prismaClient.$disconnect()
        })
    }

    process.on("SIGTERM", () => {
        downServerGracefully()
    })
    const unexpectedErrorHandler = (error: Error) => {
        myLogger().error(error)
        downServerGracefully("unexpectedErrorHandler : Server closed")
    }

    process.on("uncaughtException", unexpectedErrorHandler)
    process.on("unhandledRejection", unexpectedErrorHandler)
}
