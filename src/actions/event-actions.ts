"use server";

import { Prisma, QuestionType, RegistrationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ensureAdmin, ensureProfileCompleted } from "@/actions/auth-helpers";
import { ensurePaymentOrder } from "@/lib/payment";
import { prisma } from "@/lib/prisma";
import { uploadEventImage } from "@/lib/uploads";

const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(["FITNESS", "TRIP"]),
  date: z.coerce.date(),
  location: z.string().min(3),
  price: z.coerce.number().min(0),
  capacity: z.coerce.number().min(1),
});

const questionSchema = z.object({
  label: z.string().min(1),
  type: z.nativeEnum(QuestionType),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

const answersSchema = z.array(
  z.object({
    questionId: z.string().min(1),
    answer: z.string().min(1),
  }),
);

const leaderboardSchema = z.object({
  eventId: z.string().min(1),
  userId: z.string().min(1),
  score: z.coerce.number().int().min(0),
  rank: z.coerce.number().int().min(1),
});

function parseQuestions(formData: FormData) {
  const rawQuestions = formData.get("questions");
  if (!rawQuestions || typeof rawQuestions !== "string") return [];

  const parsedJson = JSON.parse(rawQuestions) as unknown;
  const parsed = z.array(questionSchema).safeParse(parsedJson);
  if (!parsed.success) {
    throw new Error("Invalid questions payload");
  }

  parsed.data.forEach((question) => {
    if (
      (question.type === "RADIO" || question.type === "CHECKBOX") &&
      (!question.options || question.options.length === 0)
    ) {
      throw new Error("Options are required for radio and checkbox questions");
    }
  });

  return parsed.data;
}

async function replaceEventQuestions(eventId: string, questions: ReturnType<typeof parseQuestions>) {
  await prisma.$transaction(async (tx) => {
    const existingQuestionIds = (
      await tx.eventQuestion.findMany({
        where: { eventId },
        select: { id: true },
      })
    ).map((item) => item.id);

    if (existingQuestionIds.length > 0) {
      await tx.registrationAnswer.deleteMany({
        where: { questionId: { in: existingQuestionIds } },
      });
    }

    await tx.eventQuestion.deleteMany({ where: { eventId } });

    if (questions.length > 0) {
      await tx.eventQuestion.createMany({
        data: questions.map((question) => ({
          eventId,
          label: question.label,
          type: question.type,
          required: question.required,
          options: question.options
            ? (question.options.filter(Boolean) as Prisma.JsonArray)
            : Prisma.JsonNull,
        })),
      });
    }
  });
}

export async function createEventAction(formData: FormData) {
  const admin = await ensureAdmin();
  const parsed = createEventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    date: formData.get("date"),
    location: formData.get("location"),
    price: formData.get("price"),
    capacity: formData.get("capacity"),
  });

  if (!parsed.success) {
    throw new Error("Invalid event payload");
  }

  const questions = parseQuestions(formData);
  const imageFile = formData.get("image");
  const imageUrl = imageFile instanceof File ? await uploadEventImage(imageFile) : null;

  const event = await prisma.event.create({
    data: {
      ...parsed.data,
      imageUrl,
      createdById: admin.id,
    },
  });

  await replaceEventQuestions(event.id, questions);

  revalidatePath("/");
  revalidatePath("/admin/events");
  revalidatePath("/admin/overview");
}

export async function updateEventAction(eventId: string, formData: FormData) {
  await ensureAdmin();

  const parsed = createEventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    date: formData.get("date"),
    location: formData.get("location"),
    price: formData.get("price"),
    capacity: formData.get("capacity"),
  });

  if (!parsed.success) {
    throw new Error("Invalid event payload");
  }

  const questions = parseQuestions(formData);
  const imageFile = formData.get("image");
  const newImageUrl = imageFile instanceof File ? await uploadEventImage(imageFile) : null;

  await prisma.event.update({
    where: { id: eventId },
    data: {
      ...parsed.data,
      ...(newImageUrl ? { imageUrl: newImageUrl } : {}),
    },
  });

  await replaceEventQuestions(eventId, questions);

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}/edit`);
}

export async function registerForEventWithAnswersAction(
  eventId: string,
  rawAnswers: { questionId: string; answer: string }[],
) {
  const user = await ensureProfileCompleted(`/events/${eventId}`);

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { registrations: true } }, questions: true },
  });

  if (!event) throw new Error("Event not found");
  if (event._count.registrations >= event.capacity) throw new Error("Event is full");

  const parsedAnswers = answersSchema.safeParse(rawAnswers);
  if (!parsedAnswers.success) {
    throw new Error("Please answer the required questions.");
  }

  const answersMap = new Map(parsedAnswers.data.map((answer) => [answer.questionId, answer.answer]));

  for (const question of event.questions) {
    if (question.required) {
      const value = answersMap.get(question.id);
      if (!value || !value.trim()) {
        throw new Error(`Please answer: ${question.label}`);
      }
    }
  }

  const registration = await prisma.registration.upsert({
    where: {
      userId_eventId: {
        userId: user.id,
        eventId,
      },
    },
    update: {
      status: RegistrationStatus.PENDING,
    },
    create: {
      userId: user.id,
      eventId,
      status: RegistrationStatus.PENDING,
    },
  });

  await prisma.registrationAnswer.deleteMany({
    where: { registrationId: registration.id },
  });

  if (parsedAnswers.data.length > 0) {
    await prisma.registrationAnswer.createMany({
      data: parsedAnswers.data.map((answer) => ({
        registrationId: registration.id,
        questionId: answer.questionId,
        answer: answer.answer,
      })),
    });
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/my-registrations");
  revalidatePath("/admin/registrations");
}

export async function registerForEventAction(eventId: string) {
  await registerForEventWithAnswersAction(eventId, []);
}

export async function reviewRegistrationAction(
  registrationId: string,
  decision: "APPROVED" | "REJECTED",
) {
  await ensureAdmin();

  const registration = await prisma.registration.update({
    where: { id: registrationId },
    data: {
      status: decision,
      approvedAt: decision === "APPROVED" ? new Date() : null,
    },
  });

  if (decision === "APPROVED") {
    await ensurePaymentOrder(registration.id);
  }

  revalidatePath("/admin/registrations");
  revalidatePath(`/events/${registration.eventId}`);
  revalidatePath("/my-registrations");
}

export async function addLeaderboardResultAction(formData: FormData) {
  await ensureAdmin();

  const parsed = leaderboardSchema.safeParse({
    eventId: formData.get("eventId"),
    userId: formData.get("userId"),
    score: formData.get("score"),
    rank: formData.get("rank"),
  });

  if (!parsed.success) {
    throw new Error("Invalid leaderboard payload");
  }

  await prisma.leaderboard.upsert({
    where: {
      eventId_userId: {
        eventId: parsed.data.eventId,
        userId: parsed.data.userId,
      },
    },
    update: {
      score: parsed.data.score,
      rank: parsed.data.rank,
    },
    create: parsed.data,
  });

  revalidatePath(`/events/${parsed.data.eventId}/leaderboard`);
  revalidatePath("/admin/leaderboard");
}
