import { z } from "zod"

export const EmailParamDto = z.object({
    email: z.string().trim().email(),
})

export type IEmailParamDto = z.infer<typeof EmailParamDto>
