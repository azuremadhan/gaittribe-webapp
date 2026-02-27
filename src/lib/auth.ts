import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Gender, Role } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

/* =========================
   Validation Schemas
========================= */

const signupSchema = z.object({
  mode: z.literal("signup"),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  gender: z.nativeEnum(Gender),
  age: z.coerce.number().int().min(10).max(100),
  phone: z.string().min(8),
});

const loginSchema = z.object({
  mode: z.literal("login"),
  email: z.string().email(),
  password: z.string().min(8),
});

/* =========================
   Admin Email Checker
========================= */

function isAdminEmail(email: string) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.toLowerCase());
}

/* =========================
   Credentials Provider
========================= */

const credentialsProvider = CredentialsProvider({
  name: "Email & Password",
  credentials: {
    mode: { label: "Mode", type: "text" },
    name: { label: "Name", type: "text" },
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
    gender: { label: "Gender", type: "text" },
    age: { label: "Age", type: "number" },
    phone: { label: "Phone", type: "text" },
  },

  async authorize(rawCredentials) {
    const mode = rawCredentials?.mode === "signup" ? "signup" : "login";

    /* ========= SIGNUP ========= */

    if (mode === "signup") {
      const parsed = signupSchema.safeParse({
        mode,
        name: rawCredentials?.name,
        email: rawCredentials?.email,
        password: rawCredentials?.password,
        gender: rawCredentials?.gender,
        age: rawCredentials?.age,
        phone: rawCredentials?.phone,
      });

      if (!parsed.success) return null;

      const email = parsed.data.email.toLowerCase();

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return null;

      const passwordHash = await hash(parsed.data.password, 10);

      const role: Role = isAdminEmail(email) ? "ADMIN" : "USER";

      const user = await prisma.user.create({
        data: {
          name: parsed.data.name,
          email,
          password: passwordHash,
          gender: parsed.data.gender,
          age: parsed.data.age,
          phone: parsed.data.phone,
          role,
          profileCompleted: true,
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        age: user.age,
        profileCompleted: user.profileCompleted,
      };
    }

    /* ========= LOGIN ========= */

    const parsed = loginSchema.safeParse({
      mode,
      email: rawCredentials?.email,
      password: rawCredentials?.password,
    });

    if (!parsed.success) return null;

    const email = parsed.data.email.toLowerCase();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.password) return null;

    const validPassword = await compare(parsed.data.password, user.password);
    if (!validPassword) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
      profileCompleted: user.profileCompleted,
    };
  },
});

/* =========================
   Providers
========================= */

const providers: NextAuthOptions["providers"] = [credentialsProvider];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

/* =========================
   NextAuth Config
========================= */

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers,

  callbacks: {
    /* ========= SIGN IN ========= */
    async signIn({ user, account }) {
      if (!user.email) return false;

      const email = user.email.toLowerCase();
      const role: Role = isAdminEmail(email) ? "ADMIN" : "USER";

      // Google login handling
      if (account?.provider === "google") {
        const existing = await prisma.user.findUnique({ where: { email } });

        if (!existing) {
          await prisma.user.create({
            data: {
              email,
              name: user.name,
              image: user.image,
              role,
              profileCompleted: false,
            },
          });
        } else {
          const completed = Boolean(
            existing.gender && existing.age && existing.phone
          );

          await prisma.user.update({
            where: { id: existing.id },
            data: {
              name: user.name || existing.name,
              image: user.image || existing.image,
              role,
              profileCompleted:
                existing.profileCompleted || completed,
            },
          });
        }
      }

      return true;
    },

    /* ========= JWT ========= */
    async jwt({ token }) {
      if (!token.email) return token;

      const dbUser = await prisma.user.findUnique({
        where: { email: token.email.toLowerCase() },
        select: {
          id: true,
          role: true,
          phone: true,
          gender: true,
          age: true,
          profileCompleted: true,
        },
      });

      if (dbUser) {
        token.id = dbUser.id;
        token.role = dbUser.role;
        token.phone = dbUser.phone;
        token.gender = dbUser.gender;
        token.age = dbUser.age;
        token.profileCompleted = dbUser.profileCompleted;
      }

      return token;
    },

    /* ========= SESSION ========= */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role) ?? "USER";
        session.user.phone = (token.phone as string | null) ?? null;
        session.user.gender = (token.gender as Gender | null) ?? null;
        session.user.age = (token.age as number | null) ?? null;
        session.user.profileCompleted = Boolean(token.profileCompleted);
      }

      return session;
    },
  },
};
