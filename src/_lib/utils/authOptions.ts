import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
    providers: [],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 dias
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {}
}