import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user) return null;

        const passwordMatches = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!passwordMatches) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          supplierId: user.supplierId,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.supplierId = user.supplierId;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.sub!;
      session.user.role = token.role as Role;
      session.user.supplierId = token.supplierId as string | null;
      return session;
    },
  },
});
