import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { jsonError, requireApiUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { cravingSchema } from "@/lib/schemas";

async function hasDetailAccess(userId: string, request: Request) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { discreetMode: true, detailPinHash: true },
  });
  if (!user) return false;
  if (!user.discreetMode) return true;
  const pin = request.headers.get("x-detail-pin");
  return Boolean(pin && user.detailPinHash && (await bcrypt.compare(pin, user.detailPinHash)));
}

export async function GET(request: Request) {
  const { user, response } = await requireApiUser();
  if (response || !user) return response;
  if (!(await hasDetailAccess(user.id, request))) return jsonError("Enter your detail passcode to view these records.", 403);
  const logs = await db.cravingLog.findMany({
    where: { userId: user.id, createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ logs });
}

export async function POST(request: Request) {
  const { user, response } = await requireApiUser();
  if (response || !user) return response;
  if (!(await hasDetailAccess(user.id, request))) return jsonError("Enter your detail passcode to save this record.", 403);
  const body: unknown = await request.json().catch(() => null);
  const parsed = cravingSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Please check your check-in.", 400);
  const log = await db.cravingLog.create({
    data: {
      userId: user.id,
      intensity: parsed.data.intensity,
      internalTriggers: JSON.stringify(parsed.data.internalTriggers),
      externalTriggers: JSON.stringify(parsed.data.externalTriggers),
      copingStrategies: JSON.stringify(parsed.data.copingStrategies),
      hungry: parsed.data.hungry,
      angry: parsed.data.angry,
      lonely: parsed.data.lonely,
      tired: parsed.data.tired,
      notes: parsed.data.notes,
    },
  });
  return NextResponse.json({ log }, { status: 201 });
}
