import { initEnvConfig } from "../env.config"
import { devLogger } from "./dev.logger"
import { prodLogger } from "./prod.logger"

initEnvConfig()

export const myLogger = () => {
    if (process.env.NODE_ENV === "development") {
        return devLogger
    }
    if (process.env.NODE_ENV === "test") {
        return devLogger
    }
    return prodLogger
}
