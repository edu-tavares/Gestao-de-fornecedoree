import type { DefaultSession } from "next-auth";
import type { Role } from "@/generated/prisma/enums";

declare module "next-auth" {
  interface User {
    role: Role;
    supplierId: string | null;
  }

  interface Session {
    user: {
      role: Role;
      supplierId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    supplierId: string | null;
  }
}
