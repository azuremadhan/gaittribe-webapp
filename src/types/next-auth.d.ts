import { Gender, Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
      phone?: string | null;
      gender?: Gender | null;
      age?: number | null;
      profileCompleted: boolean;
    };
  }

  interface User {
    role: Role;
    phone?: string | null;
    gender?: Gender | null;
    age?: number | null;
    profileCompleted: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    phone?: string | null;
    gender?: Gender | null;
    age?: number | null;
    profileCompleted?: boolean;
  }
}
