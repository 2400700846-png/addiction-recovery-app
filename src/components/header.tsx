"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Moon, Sun, Sprout } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Header({
  discreet,
  onDiscreetChange,
  onSignOut,
}: {
  discreet: boolean;
  onDiscreetChange: (value: boolean) => void;
  onSignOut: () => void;
}) {
  const { theme, setTheme } = useTheme();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function toggleDiscreet() {
    setError("");
    let submittedPassword = "";
    if (discreet) {
      submittedPassword = window.prompt("Enter your account password to turn discreet mode off.") ?? "";
      if (!submittedPassword) return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/discreet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !discreet, password: submittedPassword }),
      });
      const result = (await response.json()) as { error?: string; discreetMode?: boolean };
      if (!response.ok) throw new Error(result.error ?? "Could not update privacy mode.");
      onDiscreetChange(Boolean(result.discreetMode));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update privacy mode.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className="border-b border-border bg-card/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            {discreet ? <Eye size={18} /> : <Sprout size={19} />}
          </span>
          <span>
            <span className="block font-display text-lg font-semibold leading-tight">{discreet ? "Day by day" : "Steady"}</span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              {discreet ? "A little at a time" : "Recovery, at your pace"}
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <Button type="button" variant={discreet ? "secondary" : "outline"} size="sm" onClick={toggleDiscreet} disabled={busy}>
              {discreet ? <EyeOff size={15} /> : <Eye size={15} />}
              {discreet ? "Private mode on" : "Discreet mode"}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Toggle light and dark theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button type="button" onClick={onSignOut} variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign out
          </Button>
          <Button type="button" onClick={toggleDiscreet} variant="outline" size="icon" className="sm:hidden" aria-label="Toggle discreet mode">
            {discreet ? <EyeOff size={17} /> : <Eye size={17} />}
          </Button>
        </div>
      </div>
      {error ? (
        <div className="mx-auto max-w-7xl px-4 pb-3 text-right text-xs text-rose sm:px-6 lg:px-8" role="alert">
          {error} {error.includes("Set a detail passcode") ? <Link className="underline" href="/settings">Set it in Settings</Link> : null}
        </div>
      ) : null}
    </header>
  );
}
