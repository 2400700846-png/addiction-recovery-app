"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, KeyRound, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePrivacyMode } from "@/components/app-shell";

type Clock = { startDate: string; target: string; moneySavedPerDay: number } | null;

function localDateTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export function SettingsWorkspace() {
  const { discreet } = usePrivacyMode();
  const [clock, setClock] = useState<Clock>(null);
  const [startDate, setStartDate] = useState("");
  const [target, setTarget] = useState("");
  const [money, setMoney] = useState("0");
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [clockMessage, setClockMessage] = useState("");
  const [pinMessage, setPinMessage] = useState("");
  const [clockError, setClockError] = useState("");
  const [pinError, setPinError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/settings/clock")
      .then(async (response) => {
        const result = (await response.json()) as { clock?: Clock; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Couldn't load your settings.");
        if (result.clock) {
          setClock(result.clock);
          setStartDate(localDateTime(result.clock.startDate));
          setTarget(result.clock.target);
          setMoney(String(result.clock.moneySavedPerDay));
        }
      })
      .catch((reason: unknown) => setClockError(reason instanceof Error ? reason.message : "Couldn't load your settings."));
  }, []);

  async function saveClock(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setClockError("");
    setClockMessage("");
    try {
      const response = await fetch("/api/settings/clock", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: new Date(startDate).toISOString(), target, moneySavedPerDay: Number(money) }),
      });
      const result = (await response.json()) as { clock?: Clock; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Couldn't save your clock.");
      if (result.clock) setClock(result.clock);
      setClockMessage("Your clock settings are saved.");
    } catch (reason) {
      setClockError(reason instanceof Error ? reason.message : "Couldn't save your clock.");
    } finally {
      setBusy(false);
    }
  }

  async function savePin(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setPinError("");
    setPinMessage("");
    try {
      const response = await fetch("/api/pin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Couldn't save your passcode.");
      setPin("");
      setPassword("");
      setPinMessage("Your detail passcode has been set.");
    } catch (reason) {
      setPinError(reason instanceof Error ? reason.message : "Couldn't save your passcode.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-7">
      <div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Your space</p><h1 className="mt-2 font-display text-3xl sm:text-4xl">Settings</h1><p className="mt-2 text-sm text-muted-foreground">Make this feel right for you. You can change these whenever you like.</p></div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><div className="flex items-center gap-2 text-primary"><CalendarDays size={18} /><CardTitle>Your personal goal</CardTitle></div><CardDescription>Set a date and optional daily amount for your timer. Changing the date is just a way to mark a new chapter, never a judgment.</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={saveClock} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="startDate">{discreet ? "Timer start" : "Recovery start date and time"}</Label><Input id="startDate" type="datetime-local" value={startDate} onChange={(event) => setStartDate(event.target.value)} max={localDateTime(new Date().toISOString())} required /></div>
              <div className="space-y-2"><Label htmlFor="target">What is this goal about?</Label><Input id="target" value={target} onChange={(event) => setTarget(event.target.value)} maxLength={80} placeholder={discreet ? "A personal goal" : "forexample alcohol or a habit"} required /></div>
              <div className="space-y-2"><Label htmlFor="money">{discreet ? "Daily savings estimate (UGX)" : "Estimated money saved each day (UGX)"}</Label><Input id="money" type="number" min="0" max="100000"  value={money} onChange={(event) => setMoney(event.target.value)} required /></div>
              {clockError ? <p role="alert" className="text-sm text-rose">{clockError}</p> : null}
              {clockMessage ? <p role="status" className="text-sm text-primary">{clockMessage}</p> : null}
              <Button disabled={busy} type="submit">{busy ? "Saving..." : clock ? "Save changes" : "Set up my clock"}</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div className="flex items-center gap-2 text-primary"><LockKeyhole size={18} /><CardTitle>Discreet mode &amp; details</CardTitle></div><CardDescription>Use a separate passcode to protect detailed check-in notes while discreet mode is on. A PIN or a longer passphrase both work.</CardDescription></CardHeader>
          <CardContent>
            <div className="mb-5 rounded-xl bg-background p-4">
              <p className="flex items-center gap-2 text-sm font-medium"><KeyRound size={16} /> Private details are {discreet ? "currently hidden" : "available when signed in"}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">The detail passcode is stored as a one-way hash. You&apos;ll need it when viewing check-ins in discreet mode.</p>
            </div>
            <form onSubmit={savePin} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="detailPin">New detail passcode</Label><Input id="detailPin" type="password" autoComplete="new-password" minLength={6} maxLength={128} value={pin} onChange={(event) => setPin(event.target.value)} required /><p className="text-xs text-muted-foreground">Use at least 6 characters.</p></div>
              <div className="space-y-2"><Label htmlFor="accountPassword">Confirm with account password</Label><Input id="accountPassword" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
              {pinError ? <p role="alert" className="text-sm text-rose">{pinError}</p> : null}
              {pinMessage ? <p role="status" className="text-sm text-primary">{pinMessage}</p> : null}
              <Button variant="outline" disabled={busy} type="submit">{busy ? "Saving..." : "Set detail passcode"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
