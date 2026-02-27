"use server";

import { Gender } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ensureAuthenticated } from "@/actions/auth-helpers";
import { prisma } from "@/lib/prisma";

const completeProfileSchema = z.object({
  gender: z.nativeEnum(Gender),
  age: z.coerce.number().int().min(10).max(100),
  phone: z.string().min(8),
  next: z.string().optional(),
});

export async function completeProfileAction(formData: FormData) {
  const user = await ensureAuthenticated();

  const parsed = completeProfileSchema.safeParse({
    gender: formData.get("gender"),
    age: formData.get("age"),
    phone: formData.get("phone"),
    next: formData.get("next") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Please provide valid profile details.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      gender: parsed.data.gender,
      age: parsed.data.age,
      phone: parsed.data.phone,
      profileCompleted: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/my-registrations");

  redirect(parsed.data.next || "/");
}
