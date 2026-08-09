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

          // 1. Direct Admin authentication check (Guarantees Admin Login on Vercel & Supabase)
          const isAdmin1Input = lowerInput === "swapnilaryajua@gmail.com" || lowerInput === "swapnil";
          const isAdmin2Input = lowerInput === "namanpriyasharmajua@gmail.com" || lowerInput === "naman";

          if (isAdmin1Input && rawPassword === "Hidoi@007") {
            const hashedPassword = await bcrypt.hash("Hidoi@007", 12);
            let user = await prisma.user.findUnique({ where: { email: "swapnilaryajua@gmail.com" } });
            if (!user) {
              user = await prisma.user.create({
                data: {
                  name: "Swapnil",
                  email: "swapnilaryajua@gmail.com",
                  phone: "+919876543210",
                  password: hashedPassword,
                  role: "ADMIN",
                  year: "N/A",
                  course: "Management / Admin",
                },
              });
            } else if (user.role !== "ADMIN" || user.name !== "Swapnil") {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { name: "Swapnil", role: "ADMIN", password: hashedPassword },
              });
            }
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              isBlacklisted: user.isBlacklisted,
            };
          }

          if (isAdmin2Input && rawPassword === "Loveyou@3000") {
            const hashedPassword = await bcrypt.hash("Loveyou@3000", 12);
            let user = await prisma.user.findUnique({ where: { email: "namanpriyasharmajua@gmail.com" } });
            if (!user) {
              user = await prisma.user.create({
                data: {
                  name: "Naman",
                  email: "namanpriyasharmajua@gmail.com",
                  phone: "+919876543211",
                  password: hashedPassword,
                  role: "ADMIN",
                  year: "N/A",
                  course: "Management / Admin",
                },
              });
            } else if (user.role !== "ADMIN" || user.name !== "Naman") {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { name: "Naman", role: "ADMIN", password: hashedPassword },
              });
            }
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              isBlacklisted: user.isBlacklisted,
            };
          }

          // 2. Standard user database authentication
          let user = null;
          try {
            user = await prisma.user.findFirst({
              where: {
                OR: [
                  { email: { equals: input, mode: "insensitive" } },
                  { name: { equals: input, mode: "insensitive" } },
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
