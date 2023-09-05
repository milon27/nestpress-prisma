import * as Sentry from "@sentry/node"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import { initEnvConfig } from "./config/env.config"
import v1RouterConfig from "./config/router/v1-router.config"
import { getSentryConfig } from "./config/sentry.config"
import { globalErrorMid, notFoundMid } from "./middleware/error.mid"
import { infoMid } from "./middleware/info.mid"
import { loggerMid } from "./middleware/logger.mid"

// init
initEnvConfig()
const app = express()
Sentry.init(getSentryConfig(app))

// middleware
app.use(cors({ origin: true, credentials: true }))
app.use(helmet())
app.use(Sentry.Handlers.requestHandler())
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use([infoMid, loggerMid])
app.use(Sentry.Handlers.tracingHandler())

// routers
app.use("/v1", v1RouterConfig)

// global error handle
app.use(Sentry.Handlers.errorHandler())
app.use(notFoundMid)
app.use(globalErrorMid)

export default app
