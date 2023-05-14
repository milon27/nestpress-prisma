import dotenv from "dotenv"
import path from "path"

// const envPath = process.argv[2] || ".env"
// const envFullPath = path.resolve(envPath)

export const initEnvConfig = () => {
    const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env"
    const envFullPath = path.resolve(envPath)

    dotenv.config({
        path: envFullPath,
    })
}
