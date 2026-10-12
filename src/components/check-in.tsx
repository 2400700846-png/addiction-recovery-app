"use client";

import { useState, type FormEvent } from "react";
import { Check, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePrivacyMode } from "@/components/app-shell";

const haltItems = [
  { key: "hungry", label: "Hungry", kind: "body" },
  { key: "angry", label: "Angry", kind: "feeling" },
  { key: "lonely", label: "Lonely", kind: "connection" },
  { key: "tired", label: "Tired", kind: "rest" },
] as const;

export function CheckIn() {
  const { discreet } = usePrivacyMode();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [intensity, setIntensity] = useState(5);
  const [pin, setPin] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const response = await fetch("/api/cravings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(discreet ? { "X-Detail-Pin": pin } : {}),
        },
        body: JSON.stringify({
          intensity,
          internalTriggers: [],
          externalTriggers: [],
          copingStrategies: [],
          hungry: Boolean(checked.hungry),
          angry: Boolean(checked.angry),
          lonely: Boolean(checked.lonely),
          tired: Boolean(checked.tired),
          notes: "Quick check-in",
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Couldn't save your check-in.");
      setSaved(true);
      setChecked({});
      setPin("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn't save your check-in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-primary"><HeartHandshake size={18} /><p className="text-xs font-semibold uppercase tracking-[.15em]">{discreet ? "Pause & notice" : "A quick HALT check-in"}</p></div>
        <CardTitle>{discreet ? "What might help right now?" : "How are you arriving?"}</CardTitle>
        <CardDescription>{discreet ? "Notice what your body or mind might need." : "Check in with yourself, without judgment."}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit}>
          <div className="grid grid-cols-2 gap-2">
            {haltItems.map((item) => (
              <button
                type="button"
                key={item.key}
                aria-pressed={Boolean(checked[item.key])}
                onClick={() => setChecked((current) => ({ ...current, [item.key]: !current[item.key] }))}
                className={`flex items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition-colors ${checked[item.key] ? "border-primary bg-primary/10 text-primary" : "bg-background hover:bg-muted"}`}
              >
                <span><span className="block font-medium">{discreet ? item.kind : item.label}</span><span className="text-xs text-muted-foreground">{item.label}</span></span>
                {checked[item.key] ? <Check size={16} /> : null}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="quick-intensity" className="text-xs font-medium">Urge intensity, if relevant</label>
              <span className="text-xs text-muted-foreground">{intensity} / 10</span>
            </div>
            <input id="quick-intensity" type="range" min="1" max="10" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} className="w-full accent-[#647e70]" />
          </div>
          {discreet ? (
            <div className="mt-4 space-y-2">
              <label htmlFor="quick-pin" className="text-xs font-medium">Detail passcode</label>
              <Input id="quick-pin" type="password" autoComplete="current-password" value={pin} onChange={(event) => setPin(event.target.value)} required />
            </div>
          ) : null}
          {error ? <p role="alert" className="mt-3 text-sm text-rose">{error}</p> : null}
          {saved ? <p className="mt-3 text-sm text-primary">Check-in saved. Thank you for pausing.</p> : null}
          <Button type="submit" variant="secondary" className="mt-4 w-full" disabled={busy}>{busy ? "Saving..." : "Save this check-in"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
