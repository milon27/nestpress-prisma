import nodemailer from "nodemailer"
import { myLogger } from "../../config/logger"
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
    sendEmail: async ({ to, subject, html }: EmailData): Promise<void> => {
        try {
            const mailOptions = {
                from: process.env.SMTP_EMAIL_FROM || "noreply@example.com", // Sender's email address
                to, // Recipient's email address
                subject, // Subject of the email
                html, // HTML content of the email
            }

            await mailTransporter.sendMail(mailOptions)
            myLogger().info(`Email sent to ${to}`)
        } catch (error) {
            myLogger().error(`Error sending email: ${(error as Error).message}`)
            throw new ServerError()
        }
    },
}
