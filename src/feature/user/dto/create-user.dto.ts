import { Gender } from "@prisma/client"
import Joi from "joi"
import { Constant } from "../../../config/constant/common.constant"

export interface ICreateUserDto {
    fullName: string
    email: string
    password: string
    gender: Gender
}

export const CreateUserDto = Joi.object<ICreateUserDto>({
    fullName: Joi.string().trim().min(2).regex(new RegExp(Constant.STRING_NUM_SPACE_PATTERN)).required(),
    email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().trim().min(6).required(),
    gender: Joi.string()
        .valid(...Object.values(Gender))
        .required(),
})
