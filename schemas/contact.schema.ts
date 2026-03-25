import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.email("Invalid email address").max(255, "Email is too long"),
  phone: z.string().trim().min(1, "Phone is required").max(20, "Phone is too long").optional(),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message is too long"),
});

type ContactFormType = z.infer<typeof contactSchema>


const serviceSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.email("Invalid email address").max(255, "Email is too long"),
  phone: z.string().trim().optional(),
  service: z.string().trim().min(1, "Service is required").max(100, "Service is too long"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message is too long"),
});

type ServiceFormType = z.infer<typeof serviceSchema>

export {
  contactSchema,
  type ContactFormType,

  serviceSchema,
  type ServiceFormType
}



