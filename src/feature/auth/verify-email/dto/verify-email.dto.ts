import { z } from "zod"

export const VerifyEmailDto = z.object({
    code: z.string().trim(),
})

export type IVerifyEmailDto = z.infer<typeof VerifyEmailDto>
