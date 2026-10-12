"use client";

import Link from "next/link";
import { ArrowRight, Compass, Heart, Shield } from "lucide-react";
import { usePrivacyMode } from "@/components/app-shell";
import { CheckIn } from "@/components/check-in";
import { ClockCard } from "@/components/clock-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardContent({
  name,
  startDate,
  moneySavedPerDay,
}: {
  name: string;
  startDate: string | null;
  moneySavedPerDay: number;
}) {
  const { discreet } = usePrivacyMode();
  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">{discreet ? "A fresh moment is here" : "Your recovery space"}</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">{discreet ? "Welcome back" : `Welcome, ${name}`}</h1>
          <p className="mt-2 text-sm text-muted-foreground">No need to have it all figured out. Just start where you are.</p>
        </div>
        <Link href="/emergency"><Button variant="outline"><Heart size={16} /> I could use support</Button></Link>
      </div>
      <ClockCard startDate={startDate} moneySavedPerDay={moneySavedPerDay} />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <CheckIn />
        <div className="space-y-4">
          <Card className="bg-[#e9eee8] dark:bg-[#25352d]">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-primary"><Compass size={18} /></div>
              <h2 className="mt-4 font-display text-xl">{discreet ? "Make room for a moment" : "An urge can be a wave"}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Try a guided breathing pause. You can take it one breath at a time, and stop whenever you like.</p>
              <Link href="/cravings" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Explore tools <ArrowRight size={15} /></Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex gap-3 p-5">
              <Shield size={18} className="mt-0.5 shrink-0 text-primary" />
              <div><p className="text-sm font-medium">A gentle reminder</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">A difficult moment doesn&apos;t erase the care you&apos;ve put into yourself. There is always a next step.</p></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
