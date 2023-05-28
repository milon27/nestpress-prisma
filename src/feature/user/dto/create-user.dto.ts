import { Gender } from "@prisma/client"
import { z } from "zod"
import { Constant } from "../../../config/constant/common.constant"

export const CreateUserDto = z.object({
    fullName: z.string().trim().min(2).regex(new RegExp(Constant.STRING_NUM_SPACE_PATTERN)),
    email: z.string().trim().email(),
    password: z.string().trim().min(6),
    gender: z.nativeEnum(Gender),
})

export type ICreateUserDto = z.infer<typeof CreateUserDto>
