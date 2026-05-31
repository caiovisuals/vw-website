import { prisma } from "@/_lib/prisma"

export type AuditAction =
    | "USER_ROLE_CHANGED"
    | "USER_DELETED"
    | "USER_DATA_EXPORTED"
    | "LEAD_STATUS_CHANGED"
    | "CAR_CREATED"
    | "CAR_UPDATED"
    | "CAR_DELETED"
    | "DEALER_CREATED"
    | "DEALER_UPDATED"
    | "DEALER_DELETED"
    | "OFFER_CREATED"
    | "OFFER_UPDATED"
    | "OFFER_DELETED"
    | "ACCOUNT_DELETED"

export interface AuditEntry {
    actorId: string
    actorEmail?: string
    action: AuditAction
    targetId?: string
    targetType?: string
    metadata?: Record<string, unknown>
    ip?: string
}

export async function auditLog(entry: AuditEntry): Promise<void> {
    const structured = {
        timestamp: new Date().toISOString(),
        ...entry,
    }

    // Always log to stdout in structured JSON format
    console.log("[AUDIT]", JSON.stringify(structured))

    // Persist to DB when the AuditLog table exists (run migration first)
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma as any).auditLog?.create({
            data: {
                actorId: entry.actorId,
                action: entry.action,
                targetId: entry.targetId ?? null,
                targetType: entry.targetType ?? null,
                metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
                ip: entry.ip ?? null,
            },
        })
    } catch {
        // Table may not exist yet — structured log above is the fallback
    }
}