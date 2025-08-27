import NextAuth from "next-auth"
import type { AuthOptions, User, Account, Profile } from "next-auth"
import type { JWT } from "next-auth/jwt"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { getPrisma } from "@/src/lib/db"
import bcrypt from "bcryptjs"

// Extend the User type to include our custom fields
import type { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    } & DefaultSession["user"]
    accessToken?: string
    error?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: string
    user?: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

const config: AuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', { code, metadata });
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
    debug(code, metadata) {
      console.log('NextAuth Debug:', { code, metadata });
    }
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      },
      profile(profile) {
        console.log('GitHub Profile:', profile);
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url
        };
      }
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile'
        }
      },
      profile(profile) {
        console.log('Google Profile:', profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture
        };
      }
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
    async signIn({ user, account, profile, email, credentials }) {
      console.log('SignIn Callback:', { user, account, profile, email, credentials });
      
      try {
        if (account && account.provider !== "credentials" && user?.email) {
          const prisma = await getPrisma()
          console.log('Upserting user in database:', user.email);
          
          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: { 
              name: user.name || undefined, 
              image: user.image || undefined,
              emailVerified: new Date()
            },
            create: { 
              email: user.email, 
              name: user.name || null, 
              image: user.image || null,
              emailVerified: new Date()
            },
          });
          console.log('Database user updated/created:', dbUser);
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    jwt({ token, user, account, profile }: { token: JWT; user?: User; account?: Account | null; profile?: Profile }): JWT {
      // Initial sign in
      if (account && user) {
        console.log('JWT Callback - Initial Sign In:', { token, user, account, profile });
        
        // Create a new token object with the required properties
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : undefined,
          user: {
            id: user.id,
            name: user.name || null,
            email: user.email || null,
            image: user.image || null
          }
        };
      }
      
      // Return previous token if this isn't the initial sign-in
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback:', { session, token });
      
      // Create a new session object with the required properties
      const newSession = {
        ...session,
        user: {
          ...session.user,
          id: token.user?.id || '',
          name: token.user?.name || session.user.name,
          email: token.user?.email || session.user.email,
          image: token.user?.image || session.user.image
        },
        accessToken: token.accessToken,
        error: token.error
      };
      
      return newSession;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect Callback:', { url, baseUrl });
      
      // Check if the URL is relative
      if (url.startsWith("/")) return `${baseUrl}${url}`
      
      // Check if the URL is on the same origin
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) return url;
      } catch (e) {
        console.error('Invalid URL in redirect callback:', e);
      }
      
      return baseUrl;
    },
  },
}

// NextAuth v4 App Router style: create a single handler and export for both methods
const handler = NextAuth(config)
export { handler as GET, handler as POST }
