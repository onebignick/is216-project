import nodemailer from "nodemailer";

export interface EmailNotificationOptions {
    from? : string;
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export class EmailService {

    async sendEmailNotification(mailOptions: EmailNotificationOptions) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_APP_PASSWORD,
            }
        })

        mailOptions.from = process.env.GMAIL_EMAIL;
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(info.response)
        } catch (e) {
            console.error(e.message);
        }

    }
}