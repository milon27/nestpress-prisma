import { format, createLogger, transports } from "winston"

export const prodLogger = createLogger({
    level: "info",
    format: format.combine(
        format.errors({ stack: true }), // <-- use errors format
        format.timestamp(),
        format.prettyPrint()
    ),
    transports: [new transports.Console()],
})
