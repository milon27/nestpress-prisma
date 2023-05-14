// import { IJwtRole } from '../../models/User'

declare namespace Express {
    // type PrismaClient = import("@prisma/client").PrismaClient
    type ICurrentUser = import("../../model/current-user.model").ICurrentUser

    export interface Request {
        user: ICurrentUser
        // prisma: PrismaClient
        agent: "android" | "browser" | "postman"
        isHttps: boolean
        myBaseUrl: string
        accessToken?: string
        refreshToken?: string
    }
}
