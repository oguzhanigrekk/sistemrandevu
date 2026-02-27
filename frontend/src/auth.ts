import NextAuth, { DefaultSession } from "next-auth"
import Keycloak from "next-auth/providers/keycloak"

declare module "next-auth" {
    interface Session {
        accessToken?: string
        user: {
            id: string
        } & DefaultSession["user"]
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Keycloak({
            clientId: process.env.KEYCLOAK_ID || "nextjs-client",
            clientSecret: process.env.KEYCLOAK_SECRET || "my-client-secret",
            issuer: process.env.KEYCLOAK_ISSUER || "http://auth-sistemrandevu.biasdanismanlik.com/realms/kuafor_realm",
            // Specify internal Docker URLs for server-to-server calls to avoid public routing issues
            authorization: `${process.env.KEYCLOAK_ISSUER || "http://auth-sistemrandevu.biasdanismanlik.com/realms/kuafor_realm"}/protocol/openid-connect/auth`,
            token: `http://kuafor_keycloak:8080/realms/kuafor_realm/protocol/openid-connect/token`,
            userinfo: `http://kuafor_keycloak:8080/realms/kuafor_realm/protocol/openid-connect/userinfo`,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token
                token.idToken = account.id_token
                token.expiresAt = account.expires_at
            }
            return token
        },
        async session({ session, token }) {
            if (token?.accessToken) {
                session.accessToken = token.accessToken as string
            }
            return session
        },
    },
    // Adding debug logging to identify nextauth metadata discovery issues
    debug: true,
})
