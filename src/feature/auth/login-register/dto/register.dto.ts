import { z } from "zod"
import { CreateUserDto } from "../../../user/dto/create-user.dto"

export enum RegisterProvider {
    simple = "simple",
    google = "google",
}

export const RegisterDto = z.object({
    provider: z.nativeEnum(RegisterProvider),
    user: CreateUserDto,
})

export type IRegisterDto = z.infer<typeof RegisterDto>
