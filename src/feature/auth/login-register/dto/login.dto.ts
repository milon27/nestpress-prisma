import { z } from "zod"

export const LoginWithEmailDto = z.object({
    email: z.string().trim().email(),
    password: z.string().trim().min(6),
})

export type ILoginWithEmailDto = z.infer<typeof LoginWithEmailDto>

export const LoginWithGoogleDto = z.object({
    idToken: z.string().trim(),
})
export type ILoginWithGoogleDto = z.infer<typeof LoginWithGoogleDto>
