import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/__tests__/setup.ts"],
        include: ["src/__tests__/**/*.test.{ts,tsx}"],
        coverage: {
            reporter: ["text", "lcov"],
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/__tests__/**", "src/app/api/**", "src/generated/**"],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})