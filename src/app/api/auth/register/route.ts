import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession, jsonError } from "@/lib/auth";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Please check your details.", 400);
  }
  const email = parsed.data.email.toLowerCase();
  const existing = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) return jsonError("An account with this email already exists.", 409);

  const user = await db.user.create({
    data: {
      email,
      displayName: parsed.data.displayName,
      hashedPassword: await bcrypt.hash(parsed.data.password, 12),
    },
    select: { id: true },
  });
  await createSession(user.id);
  return NextResponse.json({ ok: true }, { status: 201 });
}
