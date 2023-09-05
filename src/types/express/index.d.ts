// import { IJwtRole } from '../../models/User'

declare namespace Express {
    // type PrismaClient = import("@prisma/client").PrismaClient
    type IUserJWT = import("../../common/model/current-user.model").IUserJWT

    export interface Request {
        user: IUserJWT
        // prisma: PrismaClient
        agent: "android" | "browser" | "postman"
        isHttps: boolean
        myBaseUrl: string
        accessToken?: string
        refreshToken?: string
    }
}
