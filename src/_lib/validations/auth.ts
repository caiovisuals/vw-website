import { z } from "zod"

export const registerSchema = z.object({
    name: z
        .string()
        .min(2, "Nome deve ter pelo menos 2 caracteres.")
        .max(80, "Nome muito longo.")
        .trim(),
    email: z
        .string()
        .email("E-mail inválido.")
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(8, "Senha deve ter pelo menos 8 caracteres.")
        .max(128, "Senha muito longa.")
        .regex(/[A-Z]/, "Senha deve ter pelo menos uma letra maiúscula.")
        .regex(/[0-9]/, "Senha deve ter pelo menos um número."),
    phone: z
        .string()
        .regex(/^\+?[\d\s\-()]{8,20}$/, "Telefone inválido.")
        .optional()
        .or(z.literal("")),
})

export const loginSchema = z.object({
    email: z.string().email("E-mail inválido.").toLowerCase().trim(),
    password: z.string().min(1, "Informe a senha."),
})

export const forgotPasswordSchema = z.object({
    email: z.string().email("E-mail inválido.").toLowerCase().trim(),
})

export const resetPasswordSchema = z
    .object({
        token: z.string().min(1),
        password: z
            .string()
            .min(8, "Senha deve ter pelo menos 8 caracteres.")
            .max(128)
            .regex(/[A-Z]/, "Senha deve ter pelo menos uma letra maiúscula.")
            .regex(/[0-9]/, "Senha deve ter pelo menos um número."),
        confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "As senhas não conferem.",
        path: ["confirmPassword"],
    })

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>