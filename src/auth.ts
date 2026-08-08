import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

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
      authorize: async (credentials) => {
        try {
          if (!credentials?.name || !credentials?.password) {
            return null;
          }

          const input = String(credentials.name).trim();
          const rawPassword = String(credentials.password).trim();
          const lowerInput = input.toLowerCase();

          // 1. Direct Admin authentication check (Guarantees Admin Login on Vercel Production)
          const isAdmin1 =
            (lowerInput === "swapnilaryajua@gmail.com" || lowerInput === "swapnil") &&
            rawPassword === "Hidoi@007";

          const isAdmin2 =
            (lowerInput === "namanpriyasharmajua@gmail.com" || lowerInput === "naman") &&
            rawPassword === "Loveyou@3000";

          if (isAdmin1) {
            // Background async DB sync
            bcrypt.hash("Hidoi@007", 12).then((hashedPassword) => {
              prisma.user.upsert({
                where: { email: "swapnilaryajua@gmail.com" },
                update: { name: "Swapnil", password: hashedPassword },
                create: {
                  name: "Swapnil",
                  email: "swapnilaryajua@gmail.com",
                  phone: "+919876543210",
                  password: hashedPassword,
                  role: "ADMIN",
                  year: "N/A",
                  course: "Management / Admin",
                },
              }).catch(() => {});
            }).catch(() => {});

            return {
              id: "admin-swapnil-id",
              name: "Swapnil",
              email: "swapnilaryajua@gmail.com",
              role: "ADMIN",
              isBlacklisted: false,
            };
          }

          if (isAdmin2) {
            // Background async DB sync
            bcrypt.hash("Loveyou@3000", 12).then((hashedPassword) => {
              prisma.user.upsert({
                where: { email: "namanpriyasharmajua@gmail.com" },
                update: { name: "Naman", password: hashedPassword },
                create: {
                  name: "Naman",
                  email: "namanpriyasharmajua@gmail.com",
                  phone: "+919876543211",
                  password: hashedPassword,
                  role: "ADMIN",
                  year: "N/A",
                  course: "Management / Admin",
                },
              }).catch(() => {});
            }).catch(() => {});

            return {
              id: "admin-naman-id",
              name: "Naman",
              email: "namanpriyasharmajua@gmail.com",
              role: "ADMIN",
              isBlacklisted: false,
            };
          }

          // 2. Standard user database authentication
          let user = null;
          try {
            user = await prisma.user.findFirst({
              where: {
                OR: [
                  { email: input },
                  { name: input },
                ],
              },
            });
          } catch (dbErr) {
            console.error("Prisma lookup error:", dbErr);
          }

          if (!user) {
            return null;
          }

          if (user.isBlacklisted) {
            throw new Error("Your account has been blocked by the administrator.");
          }

          const isPasswordValid = await bcrypt.compare(rawPassword, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isBlacklisted: user.isBlacklisted,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
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
