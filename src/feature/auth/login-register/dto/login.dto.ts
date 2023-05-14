import Joi from "joi"

export interface ILoginWithEmailDto {
    email: string
    password: string
}

export const LoginWithEmailDto = Joi.object<ILoginWithEmailDto>({
    email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().trim().min(6).required(),
})

export interface ILoginWithGoogleDto {
    idToken: string
}

export const LoginWithGoogleDto = Joi.object<ILoginWithGoogleDto>({
    idToken: Joi.string().trim().required(),
})
