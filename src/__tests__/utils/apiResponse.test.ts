import { describe, it, expect } from "vitest"
import { ok, created, badRequest, unauthorized, forbidden, notFound, conflict, serverError, fromZodError } from "@/_lib/utils/apiResponse"
import { z, ZodError } from "zod"

async function body(res: Response) {
    return res.json()
}

describe("apiResponse helpers", () => {
    it("ok() returns 200 with success: true", async () => {
        const res = ok({ id: "1" }, "Done")
        expect(res.status).toBe(200)
        const json = await body(res)
        expect(json.success).toBe(true)
        expect(json.data).toEqual({ id: "1" })
        expect(json.message).toBe("Done")
    })

    it("created() returns 201", () => {
        const res = created({ id: "2" })
        expect(res.status).toBe(201)
    })

    it("badRequest() returns 400 with success: false", async () => {
        const res = badRequest("Invalid input")
        expect(res.status).toBe(400)
        const json = await body(res)
        expect(json.success).toBe(false)
        expect(json.error).toBe("Invalid input")
    })

    it("unauthorized() returns 401", () => {
        expect(unauthorized().status).toBe(401)
    })

    it("forbidden() returns 403", () => {
        expect(forbidden().status).toBe(403)
    })

    it("notFound() returns 404", () => {
        expect(notFound().status).toBe(404)
    })

    it("conflict() returns 409", () => {
        expect(conflict("Already exists").status).toBe(409)
    })

    it("serverError() returns 500", () => {
        expect(serverError().status).toBe(500)
    })

    it("fromZodError() maps Zod field errors", async () => {
        const schema = z.object({ email: z.string().email(), age: z.number().min(18) })
        let zodErr: ZodError | null = null
        try {
            schema.parse({ email: "bad", age: 10 })
        } catch (e) {
            zodErr = e as ZodError
        }

        expect(zodErr).not.toBeNull()
        const res = fromZodError(zodErr!)
        expect(res.status).toBe(400)
        const json = await body(res)
        expect(json.fields).toHaveProperty("email")
        expect(json.fields).toHaveProperty("age")
    })
})