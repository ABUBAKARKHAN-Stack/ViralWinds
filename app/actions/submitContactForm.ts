"use server";

import { transporter } from "@/lib/nodemailer";
import { ContactFormType, ServiceFormType } from "@/schemas/contact.schema";
import path from "path";

type SubmitContactFormResult = {
    success: boolean;
    message: string;
    error?: string;
};

export async function submitContactForm(
    data: ContactFormType | ServiceFormType
): Promise<SubmitContactFormResult> {
    try {
        const adminEmail = process.env.SMTP_USER!;
        const fromEmail = process.env.SMTP_USER!;
        const submittedAt = new Date().toLocaleString();

        const logoAttachment = {
            filename: "logo.png",
            path: path.join(process.cwd(), "public/assets/logo.png"),
            cid: "logo",
        };

        const adminMail = {
            from: `"Viral Winds Contact Form" <${fromEmail}>`,
            to: `"Viral Winds Admin" <${adminEmail}>`,
            replyTo: `"${data.name}" <${data.email}>`,
            subject: `New Contact Form Submission - ${data.name}`,
            html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; color: #111827; background-color: #ffffff;">
            <div style="background-color: #111827; padding: 40px 30px; text-align: center; border-bottom: 4px solid #eab308;">
                <img src="cid:logo" alt="Viral Winds Logo" style="max-width: 180px; height: auto; display: block; margin: 0 auto 15px;">
                <p style="color: #94a3b8; margin: 0; font-size: 14px; font-weight: 500;">Internal Notification • New Submission</p>
            </div>
            <div style="padding: 35px 30px;">
                <h2 style="margin-top: 0; color: #111827; font-size: 18px; font-weight: 700; border-left: 4px solid #eab308; padding-left: 12px; margin-bottom: 25px;">Form Data</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; width: 35%; font-size: 14px;">Full Name</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #111827;">${data.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Email Address</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #eab308;">${data.email}</td>
                    </tr>
                    ${data.phone
                    ? `
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Phone Number</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #111827;">${data.phone}</td>
                    </tr>`
                    : ""
                }
                    ${"service" in data
                    ? `
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Service Requested</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #111827;">
                            <span style="background-color: #fefce8; color: #854d0e; padding: 4px 10px; border-radius: 9999px; border: 1px solid #fef08a; font-size: 12px; text-transform: uppercase; font-weight: 700;">${data.service}</span>
                        </td>
                    </tr>`
                    : ""
                }
                </table>
                <div style="background-color: #f9fafb; padding: 25px; border-radius: 8px; border: 1px solid #f3f4f6;">
                    <p style="margin-top: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 15px;">User Message</p>
                    <p style="margin-bottom: 0; line-height: 1.7; color: #374151; font-size: 15px;">${data.message.replace(
                    /\n/g,
                    "<br>"
                )}</p>
                </div>
            </div>
            <div style="background-color: #111827; padding: 25px; text-align: center; color: #94a3b8; font-size: 12px;">
                <p style="margin: 0;">Sent via Viral Winds Contact System</p>
                <p style="margin: 5px 0 0 0;">${submittedAt} • © ${new Date().getFullYear()} Viral Winds</p>
            </div>
        </div>
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
            attachments: [logoAttachment],
        };

        const userMail = {
            from: `"Viral Winds Support" <${fromEmail}>`,
            to: `"${data.name}" <${data.email}>`,
            subject: "We've received your inquiry - Viral Winds",
            html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; color: #111827; background-color: #ffffff;">
            <div style="background-color: #111827; padding: 50px 30px; text-align: center; border-bottom: 4px solid #eab308;">
                <img src="cid:logo" alt="Viral Winds Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto 20px;">
                <p style="color: #eab308; margin: 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em;">Inquiry Confirmed</p>
            </div>
            <div style="padding: 40px 35px;">
                <p style="margin-top: 0; font-size: 18px; line-height: 1.6; color: #111827;">Hello <strong>${data.name
                }</strong>,</p>
                <p style="font-size: 16px; line-height: 1.7; color: #4b5563;">Thank you for contacting <strong>Viral Winds</strong>. We've successfully received your inquiry ${"service" in data
                    ? `regarding <strong>${data.service}</strong>`
                    : "through our contact form"
                }.</p>
                <p style="font-size: 16px; line-height: 1.7; color: #4b5563;">Our expert team is currently reviewing your message and we will provide a detailed response within <strong>24 hours</strong>.</p>
                
                <div style="margin: 35px 0; border-top: 1px solid #f1f5f9; padding-top: 30px;">
                    <p style="margin-top: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 12px;">Reviewing Your Message</p>
                    <div style="background-color: #f9fafb; padding: 25px; border-radius: 8px; border-left: 5px solid #eab308; font-style: italic; color: #374151; font-size: 15px; line-height: 1.6;">
                        "${data.message.replace(/\n/g, "<br>")}"
                    </div>
                </div>

                <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #f3f4f6;">
                    <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 700;">Best regards,</p>
                    <p style="margin: 5px 0 0 0; font-size: 16px; color: #eab308; font-weight: 600;">The Viral Winds Team</p>
                </div>
            </div>
            <div style="background-color: #f9fafb; padding: 25px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f3f4f6;">
                <p style="margin: 0;">Automated confirmation from Viral Winds • Please do not reply directly to this email.</p>
                <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} Viral Winds. Excellence in Digital Experiences.</p>
            </div>
        </div>
      `,
            text: `
Hi ${data.name},

Thank you for contacting Viral Winds. We've received your message and will respond within 24 hours.

Your message:
${data.message}

Best regards,
Viral Winds Team
      `,
            attachments: [logoAttachment],
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

