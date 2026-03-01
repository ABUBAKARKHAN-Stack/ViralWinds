import { transporter } from "./nodemailer";

export async function sendEmail({
    to,
    subject,
    text,
}: {
    to: string;
    subject: string;
    text: string;
}) {

    try {
        const message = await transporter.sendMail({
            from: `"Mohsin Designs" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
        });
        console.log("Email Sent Successfully!", message.messageId);
    } catch (error) {
        console.log("NODEMAILER ERROR :: ", error);
    }

}
