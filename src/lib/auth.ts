import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/src/lib/db";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                // TEST MODE — accept any credentials
                return {
                    id: "test-user-id",
                    email: credentials.email,
                    name: credentials.email.split("@")[0],
                    role: "ADMIN" as UserRole,
                    plan: "PREMIUM",
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.plan = (user as any).plan;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).plan = token.plan;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/signin",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
