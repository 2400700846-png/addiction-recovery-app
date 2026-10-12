import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { jsonError, requireApiUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { pinSchema } from "@/lib/schemas";

export async function PUT(request: Request) {
  const { user, response } = await requireApiUser();
  if (response || !user) return response;
  const body: unknown = await request.json().catch(() => null);
  if (
    !body ||
    typeof body !== "object" ||
    !("pin" in body) ||
    !("password" in body) ||
    typeof body.password !== "string"
  ) return jsonError("Enter a passcode and your account password.", 400);
  const parsed = pinSchema.safeParse({ pin: body.pin });
  if (!parsed.success) return jsonError("Your passcode must be at least 6 characters.", 400);
  const account = await db.user.findUnique({ where: { id: user.id } });
  if (!account || !(await bcrypt.compare(body.password, account.hashedPassword))) {
    return jsonError("Your account password didn't match.", 403);
  }
  await db.user.update({
    where: { id: user.id },
    data: { detailPinHash: await bcrypt.hash(parsed.data.pin, 12) },
  });
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const { user, response } = await requireApiUser();
  if (response || !user) return response;
  const body: unknown = await request.json().catch(() => null);
  const parsed = pinSchema.safeParse(body);
  if (!parsed.success) return jsonError("Enter a detail passcode with at least 6 characters.", 400);
  const account = await db.user.findUnique({ where: { id: user.id } });
  if (!account?.detailPinHash || !(await bcrypt.compare(parsed.data.pin, account.detailPinHash))) {
    return jsonError("That passcode didn't match.", 403);
  }
  return NextResponse.json({ ok: true });
}
