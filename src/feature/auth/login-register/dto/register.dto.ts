import Joi from "joi"
import { CreateUserDto, ICreateUserDto } from "../../../user/dto/create-user.dto"

export enum RegisterProvider {
    simple = "simple",
    google = "google",
}

export interface IRegisterDto {
    provider: RegisterProvider
    user: ICreateUserDto
}

export const RegisterDto = Joi.object<IRegisterDto>({
    provider: Joi.string()
        .trim()
        .valid(...Object.values(RegisterProvider))
        .required(),
    user: CreateUserDto.required(),
})
