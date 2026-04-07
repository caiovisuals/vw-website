"use client"

import { useState, useEffect } from "react"

let cachedToken: string | null = null

export async function getCSRFToken(): Promise<string> {
    if (cachedToken) return cachedToken

    const res = await fetch("/api/auth/csrf", { credentials: "include" })
    const json = await res.json()
    cachedToken = json.token as string
    return cachedToken
}

export function invalidateCSRFCache() {
    cachedToken = null
}