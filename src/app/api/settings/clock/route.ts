import { NextResponse } from "next/server";
import { jsonError, requireApiUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { clockSchema } from "@/lib/schemas";

export async function GET() {
  const { user, response } = await requireApiUser();
  if (response || !user) return response;
  const clock = await db.sobrietyClock.findUnique({ where: { userId: user.id } });
  return NextResponse.json({ clock });
}

export async function PUT(request: Request) {
  const { user, response } = await requireApiUser();
  if (response || !user) return response;
  const body: unknown = await request.json().catch(() => null);
  const parsed = clockSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Please check your goal.", 400);
  const clock = await db.sobrietyClock.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...parsed.data },
    update: parsed.data,
  });
  await db.user.update({
    where: { id: user.id },
    data: { recoveryStartDate: parsed.data.startDate },
  });
  return NextResponse.json({ clock });
}
