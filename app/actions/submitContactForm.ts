"use server"

import { ContactFormType } from "@/schemas/contact.schema";
import nodemailer from "nodemailer";

type SubmitContactFormResult = {
    success: boolean;
    message: string;
    error?: string;
};

export async function submitContactForm(data: ContactFormType): Promise<SubmitContactFormResult> {
    try {
        // 1. Send email via Nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Email to admin
        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            subject: `New Contact Form Submission from ${data.name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Message:</strong></p>
                <p>${data.message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
            `,
            text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

Message:
${data.message}

Submitted at: ${new Date().toLocaleString()}
            `
        });

        // Optional: Send confirmation email to user
        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: data.email,
            subject: 'Thank you for contacting us',
            html: `
                <h2>Thank you for reaching out!</h2>
                <p>Hi ${data.name},</p>
                <p>We've received your message and will get back to you within 24 hours.</p>
                <p><strong>Your message:</strong></p>
                <p>${data.message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p>Best regards,<br>Viral Winds Team</p>
            `,
            text: `
Thank you for reaching out!

Hi ${data.name},

We've received your message and will get back to you within 24 hours.

Your message:
${data.message}

Best regards,
Viral Winds Team
            `
        });

        return {
            success: true,
            message: 'Thank you for your message! We\'ll get back to you soon.'
        };

    } catch (error) {
        console.error('Contact form submission error:', error);
        return {
            success: false,
            message: 'Failed to send message. Please try again later.',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

