import * as Sentry from "@sentry/node"
import { Application } from "express"
import packageJson from "../../package.json"
import { initEnvConfig } from "./env.config"
import { prismaClient } from "./prisma/prisma.config"

initEnvConfig()

const { NODE_ENV, SENTRY_DSN } = process.env

export const getSentryConfig = (app: Application) => ({
    dsn: NODE_ENV !== "development" ? SENTRY_DSN : undefined,
    environment: NODE_ENV,
    release: packageJson.version,
    tracesSampleRate: 1.0,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Prisma({ client: prismaClient }),
        new Sentry.Integrations.Express({ app }),
    ],
})
