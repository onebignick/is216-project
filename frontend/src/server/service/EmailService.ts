import nodemailer from "nodemailer";
import { createEvent } from "ics";  // Import the ics package

export interface EmailNotificationOptions {
    from? : string;
    to: string;
    subject: string;
    text: string;
    html?: string;
    attachments?: Array<{
        filename: string;
        content: Buffer | string;
        contentType: string;
    }>;
}

export class EmailService {

    async sendEmailNotification(mailOptions: EmailNotificationOptions,  attachments?: Array<{ filename: string, content: string }>) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_APP_PASSWORD,
            }
        })

        mailOptions.from = process.env.GMAIL_EMAIL;
        const options = { ...mailOptions, attachments };
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(info.response)
        } catch (e) {
            console.error(e.message);
        }

    }

     // Helper function to create ICS file content
     createICSFile(event: { summary: string; description: string; location: string; start: Date; end: Date; }): string {
        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MeetGrid//EN
BEGIN:VEVENT
UID:${event.start.toISOString()}@meetgrid
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}
DTSTART:${event.start.toISOString().replace(/[-:]/g, "").split(".")[0]}
DTEND:${event.end.toISOString().replace(/[-:]/g, "").split(".")[0]}
SUMMARY:${event.summary}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
    }


}