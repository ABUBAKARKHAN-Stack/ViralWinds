"use server"

import { adminClient } from "@/sanity/lib/admin-client";
import nodemailer from "nodemailer";

type SubmitDynamicFormResult = {
    success: boolean;
    message: string;
    error?: string;
};

export async function submitDynamicForm(
    formId: string,
    formName: string,
    data: any,
    successMessageTemplate: string
): Promise<SubmitDynamicFormResult> {
    try {
        // 1. Save to Sanity
        // We'll use a generic 'submission' type or just store it as 'contactSubmission' for now
        // but with more flexible data mapping
        await adminClient.create({
            _type: 'contactSubmission', // Reusing this type, but we could make a 'dynamicSubmission'
            name: data.name || data.fullName || "Dynamic Form Submission",
            email: data.email || "no-email@provided.com",
            subject: `Form Submission: ${formName}`,
            message: JSON.stringify(data, null, 2),
            status: 'new',
            submittedAt: new Date().toISOString(),
            // We could add a field for formId if we update the schema
        });

        // 2. Send email via Nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const fieldRows = Object.entries(data)
            .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
            .join("");

        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            subject: `New Request: ${formName}`,
            html: `
                <h2>New Form Submission: ${formName}</h2>
                ${fieldRows}
                <hr>
                <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
            `,
        });

        return {
            success: true,
            message: successMessageTemplate || 'Thank you! Your submission has been received.'
        };

    } catch (error) {
        console.error('Dynamic form submission error:', error);
        return {
            success: false,
            message: 'Failed to send message. Please try again later.',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
