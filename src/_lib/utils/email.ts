import { Resend } from "resend"
import { env } from "@/_lib/env"

type SendResult = { sent: boolean }

async function sendEmail(params: {
    to: string
    subject: string
    html: string
}): Promise<SendResult> {
    if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
        console.warn("[email] RESEND_API_KEY/EMAIL_FROM ausentes — e-mail não enviado.")
        return { sent: false }
    }

    const resend = new Resend(env.RESEND_API_KEY)
    await resend.emails.send({
        from: env.EMAIL_FROM,
        to: params.to,
        subject: params.subject,
        html: params.html,
    })

    return { sent: true }
}

export async function sendPasswordResetEmail(params: {
    to: string
    name: string
    resetUrl: string
}): Promise<SendResult> {
    const html = `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
            <h1 style="font-size: 20px;">Redefinição de senha</h1>
            <p>Olá, ${escapeHtml(params.name)}.</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta Volkswagen.
            Clique no botão abaixo para criar uma nova senha. O link expira em 2 horas.</p>
            <p style="margin: 24px 0;">
                <a href="${params.resetUrl}"
                   style="background: #001e50; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none;">
                   Redefinir senha
                </a>
            </p>
            <p style="color: #666; font-size: 13px;">Se você não solicitou, ignore este e-mail.</p>
        </div>
    `

    return sendEmail({
        to: params.to,
        subject: "Redefinição de senha — Volkswagen",
        html,
    })
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}