import { User } from "@prisma/client"
import bcryptjs from "bcryptjs"
import { prismaClient } from "../../config/prisma/prisma.config"
import { Constant } from "../../config/constant/common.constant"
import { ICreateUserDto } from "./dto/create-user.dto"
import { myLogger } from "../../config/logger"

export const UserService = {
    getUserByIdentifier: async (by: "id" | "email", identifier: string): Promise<User | undefined> => {
        const user = await prismaClient.user.findUnique({
            where: {
                id: by === "id" ? identifier : undefined,
                email: by === "email" ? identifier : undefined,
            },
        })
        if (!user) {
            return undefined
        }
        return user
    },
    validateUser: async (email: string, password: string): Promise<Omit<User, "password"> | undefined> => {
        const userWithPass = await UserService.getUserByIdentifier("email", email)

        if (userWithPass) {
            const ckPass = await bcryptjs.compare(password, `${userWithPass.password}`)
            if (ckPass) {
                const user = UserService.excludePassword(userWithPass, ["password"])
                return user
            }
        }
        return undefined
    },
    createUser: async (body: ICreateUserDto, isEmailVerified = false): Promise<Omit<User, "password">> => {
        const { fullName, email, gender } = body as ICreateUserDto
        const password = body.password || Constant.DEFAULT_PASSWORD
        // get hash pass & save new user into db
        const hashPass = await bcryptjs.hash(password, await bcryptjs.genSalt(10))

        // create the new user.
        const userWithPass = await prismaClient.user.create({
            data: {
                fullName,
                email: email.toLowerCase().trim(),
                password: hashPass,
                gender,
                isEmailVerified,
            },
        })

        const user = UserService.excludePassword(userWithPass, ["password"])
        return user
    },
    updateUser: async (
        id: string,
        body: Partial<Omit<User, "id" | "createdAt">>
    ): Promise<Omit<User, "password">> => {
        // get hash pass & save new user into db
        const hashPass = body.password ? await bcryptjs.hash(body.password, await bcryptjs.genSalt(10)) : undefined

        // create the new user.
        const userWithPass = await prismaClient.user.update({
            data: {
                ...body,
                password: hashPass,
            },
            where: {
                id,
            },
        })

        const user = UserService.excludePassword(userWithPass, ["password"])
        return user
    },
    deleteUser: async (by: "id" | "email", identifier: string) => {
        try {
            await prismaClient.user.delete({
                where: {
                    id: by === "id" ? identifier : undefined,
                    email: by === "email" ? identifier : undefined,
                },
            })
        } catch (error) {
            myLogger().error(error)
        }
    },
    excludePassword: <User, Key extends keyof User>(obj: User, keys: Key[]): Omit<User, Key> => {
        // eslint-disable-next-line no-restricted-syntax
        for (const key of keys) {
            // eslint-disable-next-line no-param-reassign
            delete obj[key]
        }
        return obj
    },
}
