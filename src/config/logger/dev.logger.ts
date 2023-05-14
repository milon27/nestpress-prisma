import { format, createLogger, transports } from "winston"

export const devLogger = createLogger({
    level: "info",
    format: format.combine(
        format.errors({ stack: true }), // <-- use errors format
        format.colorize(),
        format.timestamp(),
        // format.simple(),
        format.printf(({ level, message, timestamp, stack }) => {
            if (stack) {
                // print log trace
                return `[${level}] : [${timestamp}] ➡  ${message} - ${stack}`
            }
            return `[${level}] : [${timestamp}] ➡  ${message}`
        })
    ),
    transports: [new transports.Console()],
})
