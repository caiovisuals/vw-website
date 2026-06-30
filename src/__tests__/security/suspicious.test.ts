import { describe, it, expect } from "vitest"
import { NextRequest } from "next/server"
import { detectSuspiciousActivity } from "@/_lib/security/suspicious"

function makeRequest(url: string, headers: Record<string, string> = {}): NextRequest {
    return new NextRequest(url, { headers })
}

describe("detectSuspiciousActivity", () => {
    it("flags known malicious scanner user agents", async () => {
        const req = makeRequest("https://vw.example.com/", { "user-agent": "sqlmap/1.7.2" })
        expect(await detectSuspiciousActivity(req)).toBe(true)
    })

    it("flags nikto and nmap as well", async () => {
        const nikto = makeRequest("https://vw.example.com/", { "user-agent": "Nikto/2.5" })
        const nmap = makeRequest("https://vw.example.com/", { "user-agent": "nmap-scripting-engine" })
        expect(await detectSuspiciousActivity(nikto)).toBe(true)
        expect(await detectSuspiciousActivity(nmap)).toBe(true)
    })

    it("allows a normal browser user agent", async () => {
        const req = makeRequest("https://vw.example.com/", {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        })
        expect(await detectSuspiciousActivity(req)).toBe(false)
    })

    it("flags absurdly long URLs", async () => {
        const req = makeRequest("https://vw.example.com/" + "a".repeat(3000))
        expect(await detectSuspiciousActivity(req)).toBe(true)
    })
})