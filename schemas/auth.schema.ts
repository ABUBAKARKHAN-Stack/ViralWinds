import { Roles } from "@/types/auth.types";
import z from "zod";

const baseSchema = z.object({
    fullName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
    email: z.email({ message: "Please enter a valid email address" }).trim().max(255),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Must contain uppercase letter" })
        .regex(/[0-9]/, { message: "Must contain a number" }),
    confirmPassword: z.string(),
})

export const signUpSchema = baseSchema
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });


export type SignUpFormValues = z.infer<typeof signUpSchema>;



export const signInSchema = z.object({
    email: z.email({ message: "Please enter a valid email address" }).trim(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    rememberMe: z.boolean(),
});

export type SignInFormValues = z.infer<typeof signInSchema>;


export const forgotPasswordSchema = z.object({
    email: z.email({ message: "Please enter a valid email address" }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;


export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Must contain uppercase letter" })
        .regex(/[0-9]/, { message: "Must contain a number" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const roleSchema = z.object({
    role: z.enum(Roles, {
        error: "Role is required",
    })
})

export type ChangeRoleFormValues = z.infer<typeof roleSchema>;


export const addUserSchema = signUpSchema.extend(roleSchema.shape)

export type AddUserFormValues = z.infer<typeof addUserSchema>;

export const editUserSchema = z
    .object({
        fullName: baseSchema.shape.fullName.optional(),
        email: baseSchema.shape.email.optional(),
        role: roleSchema.shape.role,
    })

export type EditUserFormValues = z.infer<typeof editUserSchema>;


export const changePasswordSchema = z.object({
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

