"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Clock3, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import { usePrivacyMode } from "@/components/app-shell";

const milestones = [
  { label: "24 hours", seconds: 24 * 60 * 60 },
  { label: "7 days", seconds: 7 * 24 * 60 * 60 },
  { label: "30 days", seconds: 30 * 24 * 60 * 60 },
  { label: "90 days", seconds: 90 * 24 * 60 * 60 },
  { label: "1 year", seconds: 365 * 24 * 60 * 60 },
];

export function ClockCard({
  startDate,
  moneySavedPerDay,
}: {
  startDate: string | null;
  moneySavedPerDay: number;
}) {
  const [now, setNow] = useState(0);
  const { discreet } = usePrivacyMode();
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!startDate) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary"><Clock3 /></div>
          <h2 className="font-display text-2xl">Whenever you&apos;re ready</h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {discreet ? "Set a start date for your goal whenever it feels right. Small steps matter, too." : "Choose a start date for your recovery clock. This is a tool for noticing progress, not measuring your worth."}
          </p>
          <Link href="/settings" className="mt-5 inline-flex"><Button>Set up your clock <ArrowRight size={16} /></Button></Link>
        </CardContent>
      </Card>
    );
  }

  const elapsed = Math.max(0, Math.floor((now - new Date(startDate).getTime()) / 1000));
  const days = Math.floor(elapsed / 86400);
  const hours = Math.floor((elapsed % 86400) / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  const saved = (elapsed / 86400) * moneySavedPerDay;
  const nextMilestone = milestones.find((item) => elapsed < item.seconds);

  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-[1.3fr_.7fr]">
        <div>
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">
              {discreet ? "Your timer" : "Your recovery journey"}
            </p>
            <CardTitle className="pt-1 text-2xl">{discreet ? "Every moment counts" : "Look how far you have come"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[["Days", days], ["Hours", hours], ["Minutes", minutes], ["Seconds", seconds]].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-background px-2 py-4 text-center sm:px-3">
                  <p className="font-display text-3xl tabular-nums sm:text-4xl">{String(value).padStart(2, "0")}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {nextMilestone ? `${Math.max(0, Math.ceil((nextMilestone.seconds - elapsed) / 86400))} days until your ${nextMilestone.label} marker` : "A year of showing up. Take a moment to honor that."}
            </p>
          </CardContent>
        </div>
        <div className="flex flex-col justify-center bg-[#f0f3ed] p-6 dark:bg-[#25352d] md:p-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Coins size={17} /> {discreet ? "Noticed savings" : "Money saved so far"}</div>
          <p className="mt-2 font-display text-4xl">{formatMoney(saved)}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">An estimate based on the daily amount you chose. Your progress is more than a number.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {milestones.map((item) => (
              <span key={item.label} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] ${elapsed >= item.seconds ? "bg-primary/15 text-primary" : "bg-background text-muted-foreground"}`}>
                {elapsed >= item.seconds ? <Check size={12} /> : null}{item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
