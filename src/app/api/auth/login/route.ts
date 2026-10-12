import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession, jsonError } from "@/lib/auth";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return jsonError("Enter a valid email and password.", 400);
  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.hashedPassword))) {
    return jsonError("That email and password combination didn't match.", 401);
  }
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
