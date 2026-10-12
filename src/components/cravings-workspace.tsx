"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Activity, LockKeyhole } from "lucide-react";
import { usePrivacyMode } from "@/components/app-shell";
import { BreathingTimer } from "@/components/breathing-timer";
import { CravingChart, type CravingPoint } from "@/components/chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Log = CravingPoint & {
  id: string;
  internalTriggers: string;
  externalTriggers: string;
  copingStrategies: string;
  notes: string;
  hungry: boolean;
  angry: boolean;
  lonely: boolean;
  tired: boolean;
};

const internalOptions = ["Stress", "Anxiety", "Sadness", "Boredom", "Celebration", "Physical discomfort"];
const externalOptions = ["People", "Place", "Time of day", "Conflict", "Availability", "Transition"];
const strategies = ["Reached out", "Changed my setting", "Moved my body", "Took a breath", "Ate or drank water", "Waited it out"];

function decode(value: string) {
  try {
    const result: unknown = JSON.parse(value);
    return Array.isArray(result) ? result.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function CravingsWorkspace() {
  const { discreet } = usePrivacyMode();
  return <CravingsContent key={String(discreet)} discreet={discreet} />;
}

function CravingsContent({ discreet }: { discreet: boolean }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(!discreet);
  const [intensity, setIntensity] = useState(5);
  const [internal, setInternal] = useState<string[]>([]);
  const [external, setExternal] = useState<string[]>([]);
  const [coping, setCoping] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [halt, setHalt] = useState({ hungry: false, angry: false, lonely: false, tired: false });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const fetchLogs = useCallback(async (secret = "") => {
    const response = await fetch("/api/cravings", {
      headers: discreet ? { "X-Detail-Pin": secret } : {},
      cache: "no-store",
    });
    const result = (await response.json()) as { logs?: Log[]; error?: string };
    if (!response.ok) throw new Error(result.error ?? "Couldn't load your check-ins.");
    return result.logs ?? [];
  }, [discreet]);

  const loadLogs = useCallback(async (secret = "") => {
    setLogs(await fetchLogs(secret));
  }, [fetchLogs]);

  useEffect(() => {
    if (discreet) return;
    fetchLogs()
      .then((items) => setLogs(items))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Couldn't load your check-ins."));
  }, [discreet, fetchLogs]);

  async function unlock(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await loadLogs(pin);
      setUnlocked(true);
      setNotice("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn't verify your passcode.");
    }
  }

  function toggle(setter: (value: string[]) => void, list: string[], item: string) {
    setter(list.includes(item) ? list.filter((value) => value !== item) : [...list, item]);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/cravings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(discreet ? { "X-Detail-Pin": pin } : {}),
        },
        body: JSON.stringify({
          intensity,
          internalTriggers: internal,
          externalTriggers: external,
          copingStrategies: coping,
          ...halt,
          notes,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Couldn't save this check-in.");
      setIntensity(5);
      setInternal([]);
      setExternal([]);
      setCoping([]);
      setNotes("");
      setHalt({ hungry: false, angry: false, lonely: false, tired: false });
      await loadLogs(discreet ? pin : "");
      setNotice("Saved. Thank you for noticing what is happening.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn't save this check-in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <div className="flex items-center gap-2 text-primary"><Activity size={18} /><p className="text-xs font-semibold uppercase tracking-[.15em]">{discreet ? "Notice & reset" : "Urge support"}</p></div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">{discreet ? "A pause for you" : "When an urge shows up"}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">This moment is temporary. Explore a tool, check in with yourself, or simply take a breath.</p>
      </div>
      <BreathingTimer />
      {discreet && !unlocked ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3"><LockKeyhole className="mt-1 text-primary" size={19} /><div><p className="font-medium">Your private check-ins are protected</p><p className="mt-1 text-sm text-muted-foreground">Enter your detail passcode to view or add detailed records.</p></div></div>
            <form onSubmit={unlock} className="flex w-full gap-2 sm:w-auto">
              <Input aria-label="Detail passcode" type="password" autoComplete="current-password" value={pin} onChange={(event) => setPin(event.target.value)} required className="sm:w-48" />
              <Button type="submit">Unlock</Button>
            </form>
          </CardContent>
        </Card>
      ) : null}
      {unlocked ? (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <Card>
            <CardHeader><CardTitle>{discreet ? "How was that moment?" : "A check-in, just for you"}</CardTitle><CardDescription>There are no wrong answers. You can skip anything you don&apos;t want to share.</CardDescription></CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={submit}>
                <div>
                  <div className="mb-3 flex items-center justify-between"><Label htmlFor="intensity">How strong does it feel right now?</Label><span className="rounded-lg bg-accent px-2.5 py-1 text-sm font-semibold text-primary">{intensity} / 10</span></div>
                  <input id="intensity" type="range" min="1" max="10" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} className="w-full accent-[#647e70]" />
                  <div className="flex justify-between text-xs text-muted-foreground"><span>A little</span><span>A lot</span></div>
                </div>
                <TriggerChoices label="What is happening inside?" options={internalOptions} selected={internal} onToggle={(value) => toggle(setInternal, internal, value)} />
                <TriggerChoices label="What is around you?" options={externalOptions} selected={external} onToggle={(value) => toggle(setExternal, external, value)} />
                <TriggerChoices label="What helped, or might help?" options={strategies} selected={coping} onToggle={(value) => toggle(setCoping, coping, value)} />
                <div>
                  <p className="mb-2 text-sm font-medium">A quick body check</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["hungry", "angry", "lonely", "tired"] as const).map((key) => (
                      <label key={key} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm capitalize">
                        <input type="checkbox" checked={halt[key]} onChange={(event) => setHalt((value) => ({ ...value, [key]: event.target.checked }))} className="accent-[#647e70]" />{key}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2"><Label htmlFor="notes">Anything else you want to remember?</Label><textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={2000} rows={3} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="Optional — a few words are enough." /></div>
                {error ? <p role="alert" className="text-sm text-rose">{error}</p> : null}
                {notice ? <p role="status" className="text-sm text-primary">{notice}</p> : null}
                <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save check-in"}</Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <CravingChart logs={logs} />
            <Card>
              <CardHeader><CardTitle>Recent check-ins</CardTitle><CardDescription>Your last seven days. Only you can see these.</CardDescription></CardHeader>
              <CardContent>
                {logs.length ? (
                  <ul className="max-h-80 space-y-3 overflow-auto">
                    {logs.map((log) => (
                      <li key={log.id} className="rounded-xl bg-background p-3">
                        <div className="flex items-center justify-between"><span className="text-sm font-medium">Intensity {log.intensity}/10</span><time className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</time></div>
                        <p className="mt-1 text-xs text-muted-foreground">{[...decode(log.internalTriggers), ...decode(log.externalTriggers), ...decode(log.copingStrategies)].join(" · ") || "A moment noticed"}</p>
                        {log.notes && log.notes !== "Quick check-in" ? <p className="mt-2 whitespace-pre-wrap text-sm">{log.notes}</p> : null}
                      </li>
                    ))}
                  </ul>
                ) : <p className="rounded-xl bg-background p-4 text-sm text-muted-foreground">When you want to check in, your entries will be here. No pressure to log every feeling.</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TriggerChoices({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={selected.includes(option)}
            onClick={() => onToggle(option)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${selected.includes(option) ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}
          >{option}</button>
        ))}
      </div>
    </fieldset>
  );
}
