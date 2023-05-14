import Joi from "joi"

export interface IForgetPasswordDto {
    code: string
    password: string
}

export const ForgetPasswordDto = Joi.object<IForgetPasswordDto>({
    code: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
})
