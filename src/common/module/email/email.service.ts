import nodemailer from "nodemailer"
import { myLogger } from "../../../config/logger"
import { ServerError } from "../../model/error.model"

const mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(`${process.env.SMTP_PORT}`) || 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
})

interface EmailData {
    to: string
    subject: string
    html: string
}

export const EmailService = {
    sendEmail: async ({ to, subject, html }: EmailData, shouldWait = true): Promise<void> => {
        try {
            const mailOptions = {
                from: process.env.SMTP_EMAIL_FROM || "noreply@example.com", // Sender's email address
                to, // Recipient's email address
                subject, // Subject of the email
                html, // HTML content of the email
            }
            if (shouldWait) {
                await mailTransporter.sendMail(mailOptions)
            } else {
                mailTransporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        myLogger().error(`Error sending email: ${(err as Error).message}`)
                        return
                    }
                    myLogger().info(`Email sent to ${to}, id: ${info.messageId}`)
                })
            }
        } catch (error) {
            myLogger().error(`Error sending email: ${(error as Error).message}`)
            throw new ServerError()
        }
    },
}
