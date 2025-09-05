import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, User as PrismaUser } from "@prisma/client";
import { compare } from "bcryptjs";
import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { logger } from "../../../../../src/lib/logger";

// Extend the NextAuth types
declare module "next-auth" {
  interface User {
    role: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

const prisma = new PrismaClient();

/**
 * Authentication configuration for NextAuth
 */
// Cast the PrismaAdapter to the correct Adapter type
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as unknown as Adapter,
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            logger.warn('Missing credentials', { email: credentials?.email ? 'provided' : 'missing' });
            throw new Error("Email and password are required");
          }

          logger.debug('Attempting authentication', { email: credentials.email });
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              passwordHash: true,
              role: true,
            },
          });

          if (!user || !user.passwordHash) {
            logger.warn('User not found or has no password', { email: credentials.email });
            throw new Error("Invalid email or password");
          }

          const isPasswordValid = await compare(credentials.password, user.passwordHash);

          if (!isPasswordValid) {
            logger.warn('Invalid password attempt', { email: credentials.email });
            throw new Error("Invalid email or password");
          }

          logger.info('User authenticated successfully', { 
            userId: user.id, 
            email: user.email,
            role: user.role
          });
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          logger.error('Authentication error', error as Error, { email: credentials?.email });
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.role = user.role;
          token.id = user.id;
          logger.debug('JWT token generated', { userId: user.id });
        }
        return token;
      } catch (error) {
        logger.error('JWT callback error', error as Error);
        throw error;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.role = token.role;
          session.user.id = token.id as string;
          logger.debug('Session created/updated', { userId: token.id });
        }
        return session;
      } catch (error) {
        logger.error('Session callback error', error as Error);
        throw error;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
