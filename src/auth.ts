import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limiter";
import { logActivity, Actions } from "@/lib/activity-logger";

declare module "next-auth" {
  interface User {
    role?: string;
    isBlacklisted?: boolean;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      isBlacklisted: boolean;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: string;
    isBlacklisted: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        if (!credentials?.name || !credentials?.password) {
          throw new Error("Name and password are required");
        }

        const user = await prisma.user.findFirst({
          where: { name: credentials.name as string },
        });

        const ip = req.headers?.get("x-forwarded-for")?.toString().split(',')[0].trim() || req.headers?.get("x-real-ip")?.toString() || "unknown-ip";
        const rateLimitKey = `login_${ip}`;
        
        const rateLimitResult = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
        if (!rateLimitResult.allowed) {
          throw new Error(`Too many login attempts. Try again in ${Math.ceil(rateLimitResult.retryAfterMs / 60000)} minutes.`);
        }

        if (!user) {
          throw new Error("Invalid credentials");
        }

        if (user.isBlacklisted) {
          throw new Error("You have been blocked by the administrator.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Log successful login
        // Note: we can't easily pass `Request` object here since `req` from Auth.js might not be compatible.
        // We just pass null for request.
        await logActivity(user.id, Actions.USER_LOGGED_IN, "User logged in", undefined);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isBlacklisted: user.isBlacklisted,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role || "USER";
        token.isBlacklisted =
          (user as { isBlacklisted?: boolean }).isBlacklisted || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isBlacklisted = token.isBlacklisted;
      }
      return session;
    },
  },
});
