import { myLogger } from "../../config/logger"
import { ServerError } from "../../model/error.model"
import { EmailService } from "./email.util"

export const SendResetPasswordEmail = async (name: string, email: string, resetLink: string): Promise<void> => {
    try {
        const emailData = {
            to: email,
            subject: "Reset your password",
            html: `<p>Hello,</p><p>You have requested to reset your password. Please click the link below to set a new password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you did not request a password reset, please ignore this email.</p>`,
        }

        await EmailService.sendEmail(emailData)
    } catch (error) {
        myLogger().error(`Error sending email: ${(error as Error).message}`)
        throw new ServerError()
    }
}

export const SendEmailVerificationCode = async (name: string, email: string, code: string): Promise<void> => {
    try {
        const emailData = {
            to: email,
            subject: `Verify Your email ${name}`,
            html: `<p>Hello,${name}</p><p>here is the email verification code: ${code}</p>`,
        }

        await EmailService.sendEmail(emailData)
    } catch (error) {
        myLogger().error(`Error sending email: ${(error as Error).message}`)
        throw new ServerError()
    }
}
