import NextAuth from "next-auth"
import type { AuthOptions } from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { getPrisma } from "@/src/lib/db"
import bcrypt from "bcryptjs"

const config: AuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Email et mot de passe",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials: { email?: string; password?: string } | undefined) {
        if (!credentials?.email || !credentials?.password) return null
        const prisma = await getPrisma()
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user?.passwordHash) return null
        const ok = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!ok) return null
        return { id: user.id, name: user.name || user.email, email: user.email, image: user.image || undefined }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }: any) {
      // For OAuth providers, ensure a User record exists
      try {
        if (account && account.provider !== "credentials" && user?.email) {
          const prisma = await getPrisma()
          await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name || undefined, image: (user as any).image || undefined },
            create: { email: user.email, name: user.name || null, image: (user as any).image || null },
          })
        }
        return true
      } catch (e) {
        return false
      }
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      return baseUrl
    },
  },
}

// NextAuth v4 App Router style: create a single handler and export for both methods
const handler = NextAuth(config)
export { handler as GET, handler as POST }
