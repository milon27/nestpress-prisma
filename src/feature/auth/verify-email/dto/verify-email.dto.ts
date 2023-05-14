import Joi from "joi"

export interface IVerifyEmailDto {
    code: string
}

export const VerifyEmailDto = Joi.object<IVerifyEmailDto>({
    code: Joi.string().trim().required(),
})
