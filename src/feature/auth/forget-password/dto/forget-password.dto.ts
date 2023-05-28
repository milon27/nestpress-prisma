import { z } from "zod"

export const ResetPasswordDto = z.object({
    code: z.string().trim(),
    password: z.string().trim(),
})

export type IResetPasswordDto = z.infer<typeof ResetPasswordDto>
