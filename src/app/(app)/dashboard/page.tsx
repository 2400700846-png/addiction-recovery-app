import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { DashboardContent } from "@/components/dashboard-content";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) return null;
  const clock = await db.sobrietyClock.findUnique({ where: { userId: user.id } });
  return (
    <DashboardContent
      name={user.discreetMode ? "" : user.displayName}
      startDate={clock?.startDate.toISOString() ?? user.recoveryStartDate?.toISOString() ?? null}
      moneySavedPerDay={clock?.moneySavedPerDay ?? 0}
    />
  );
}
