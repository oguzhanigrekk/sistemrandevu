import NextAuth, { DefaultSession } from "next-auth"
import Keycloak from "next-auth/providers/keycloak"
import Credentials from "next-auth/providers/credentials"

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
            issuer: process.env.KEYCLOAK_ISSUER || "https://auth-sistemrandevu.biasdanismanlik.com/realms/kuafor_realm",
            // Specify internal Docker URLs for server-to-server calls to avoid public routing issues
            authorization: `${process.env.KEYCLOAK_ISSUER || "https://auth-sistemrandevu.biasdanismanlik.com/realms/kuafor_realm"}/protocol/openid-connect/auth`,
            token: `http://kuafor_keycloak:8080/realms/kuafor_realm/protocol/openid-connect/token`,
            userinfo: `http://kuafor_keycloak:8080/realms/kuafor_realm/protocol/openid-connect/userinfo`,
        }),
        Credentials({
            name: "Sistem Randevu",
            credentials: {
                username: { label: "E-Posta", type: "text" },
                password: { label: "Şifre", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Lütfen e-posta ve şifrenizi girin.");
                }

                try {
                    const tokenUrl = "http://kuafor_keycloak:8080/realms/kuafor_realm/protocol/openid-connect/token";
                    const clientId = process.env.KEYCLOAK_ID || "kuafor-frontend";
                    const clientSecret = process.env.KEYCLOAK_SECRET || "my-client-secret";

                    const body = new URLSearchParams({
                        client_id: clientId,
                        client_secret: clientSecret,
                        grant_type: "password",
                        username: credentials.username as string,
                        password: credentials.password as string,
                        scope: "openid profile email",
                    });

                    const response = await fetch(tokenUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: body.toString()
                    });

                    if (!response.ok) {
                        console.error("Keycloak auth failed:", await response.text());
                        throw new Error("E-posta veya şifre hatalı.");
                    }

                    const tokens = await response.json();

                    // fetch user info
                    const userinfoUrl = "http://kuafor_keycloak:8080/realms/kuafor_realm/protocol/openid-connect/userinfo";
                    const userResponse = await fetch(userinfoUrl, {
                        headers: {
                            Authorization: `Bearer ${tokens.access_token}`
                        }
                    });

                    if (!userResponse.ok) {
                        throw new Error("Kullanıcı bilgileri alınamadı.");
                    }

                    const user = await userResponse.json();

                    return {
                        id: user.sub,
                        name: user.name || user.preferred_username,
                        email: user.email,
                        accessToken: tokens.access_token,
                    };
                } catch (error: any) {
                    throw new Error(error.message || "Giriş yapılırken bir hata oluştu.");
                }
            }
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token
                token.idToken = account.id_token
                token.expiresAt = account.expires_at
            }
            // For Credentials provider, `user` contains the accessToken returned from authorize()
            if (user && 'accessToken' in user) {
                token.accessToken = user.accessToken;
            }
            return token
        },
        async session({ session, token }) {
            if (token?.accessToken) {
                // @ts-ignore
                session.accessToken = token.accessToken as string
            }
            if (token?.sub && session.user) {
                session.user.id = token.sub;
            }
            return session
        },
    },
    // Adding debug logging to identify nextauth metadata discovery issues
    debug: true,
})
