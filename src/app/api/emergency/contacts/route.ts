import { NextResponse } from "next/server";
import { jsonError, requireApiUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { contactSchema } from "@/lib/schemas";

export async function GET() {
  const { user, response } = await requireApiUser();
  if (response || !user) return response;
  const contacts = await db.emergencyContact.findMany({
    where: { userId: user.id },
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ contacts });
}

export async function POST(request: Request) {
  const { user, response } = await requireApiUser();
  if (response || !user) return response;
  const body: unknown = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Please check the contact.", 400);
  const priority = await db.emergencyContact.count({ where: { userId: user.id } });
  const contact = await db.emergencyContact.create({
    data: { ...parsed.data, userId: user.id, priority },
  });
  return NextResponse.json({ contact }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { user, response } = await requireApiUser();
  if (response || !user) return response;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("Choose a contact to remove.", 400);
  const result = await db.emergencyContact.deleteMany({ where: { id, userId: user.id } });
  if (!result.count) return jsonError("Contact not found.", 404);
  return NextResponse.json({ ok: true });
}
