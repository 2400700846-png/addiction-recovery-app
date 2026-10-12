import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { jsonError, requireApiUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const { user, response } = await requireApiUser();
  if (response || !user) return response;
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("enabled" in body) || typeof body.enabled !== "boolean") {
    return jsonError("Choose whether to turn discreet mode on or off.", 400);
  }
  const enabled = body.enabled;
  const fullUser = await db.user.findUnique({ where: { id: user.id } });
  if (!fullUser) return jsonError("Account not found.", 404);

  if (enabled && !fullUser.detailPinHash) {
    return jsonError("Set a detail passcode in Settings before enabling discreet mode.", 400);
  }
  if (!enabled) {
    const password = "password" in body && typeof body.password === "string" ? body.password : "";
    if (!password || !(await bcrypt.compare(password, fullUser.hashedPassword))) {
      return jsonError("Enter your account password to turn discreet mode off.", 403);
    }
  }
  await db.user.update({ where: { id: user.id }, data: { discreetMode: enabled } });
  return NextResponse.json({ discreetMode: enabled });
}
