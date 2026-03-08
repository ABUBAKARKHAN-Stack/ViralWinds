"use server"

import { transporter } from "@/lib/nodemailer";
import { ContactFormType } from "@/schemas/contact.schema";

type SubmitContactFormResult = {
    success: boolean;
    message: string;
    error?: string;
};

export async function submitContactForm(
    data: ContactFormType
): Promise<SubmitContactFormResult> {
    try {
        const adminEmail = process.env.SMTP_USER!;
        const fromEmail =  process.env.SMTP_USER!;
        const submittedAt = new Date().toLocaleString();

        const adminMail = {
            from: `"Viral Winds Contact Form" <${fromEmail}>`,
            to: `"Viral Winds Admin" <${adminEmail}>`,
            replyTo: `"${data.name}" <${data.email}>`,
            subject: `New Contact Form Submission - ${data.name}`,
            html: `
        <h2>New Contact Form Submission</h2>

        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}

        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>

        <hr>
        <p><small>Submitted at: ${submittedAt}</small></p>
      `,
            text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "N/A"}

Message:
${data.message}

Submitted at: ${submittedAt}
      `,
        };

        const userMail = {
            from: `"Viral Winds Support" <${fromEmail}>`,
            to: `"${data.name}" <${data.email}>`,
            subject: "We received your message - Viral Winds",
            html: `
        <h2>Thank you for reaching out!</h2>

        <p>Hi ${data.name},</p>

        <p>We've received your message and our team will get back to you within 24 hours.</p>

        <p><strong>Your message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>

        <hr>

        <p>
          Best regards,<br>
          <strong>Viral Winds Team</strong>
        </p>
      `,
            text: `
Hi ${data.name},

Thank you for contacting Viral Winds. We've received your message and will respond within 24 hours.

Your message:
${data.message}

Best regards,
Viral Winds Team
      `,
        };

        //* Send both emails in parallel
        await Promise.all([
            transporter.sendMail(adminMail),
            transporter.sendMail(userMail),
        ]);

        return {
            success: true,
            message: "Thank you for your message! We'll get back to you soon.",
        };
    } catch (error) {
        console.error("Contact form submission error:", error);

        return {
            success: false,
            message: "Failed to send message. Please try again later.",
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

