// Aplica as migrations pendentes (`prisma migrate deploy`) durante o deploy.
//
// Roda apenas em produção na Vercel (VERCEL_ENV=production) para que deploys
// de preview, que normalmente apontam para o mesmo DATABASE_URL, não apliquem
// migrations de branches ainda não mergeadas no banco de produção.
// Para forçar em outro ambiente (ex.: outro provedor), use MIGRATE_ON_BUILD=true.
import { execSync } from "node:child_process"

const vercelEnv = process.env.VERCEL_ENV
const forced = process.env.MIGRATE_ON_BUILD === "true"

if (vercelEnv !== "production" && !forced) {
    console.log(`[migrate] pulando migrate deploy (VERCEL_ENV=${vercelEnv ?? "indefinido"}).`)
    process.exit(0)
}

console.log("[migrate] aplicando migrations pendentes...")
execSync("npx prisma migrate deploy", { stdio: "inherit" })