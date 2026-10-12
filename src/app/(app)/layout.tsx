import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getSessionUser } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return (
    <AppShell initialDiscreet={user.discreetMode} displayName={user.displayName}>
      {children}
    </AppShell>
  );
}
