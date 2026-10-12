"use client";

import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TOTAL = 15 * 60;
const phases = [
  { label: "Breathe in", duration: 4 },
  { label: "Pause softly", duration: 2 },
  { label: "Breathe out", duration: 6 },
];

export function BreathingTimer() {
  const [remaining, setRemaining] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const [voice, setVoice] = useState(false);
  const elapsed = TOTAL - remaining;
  const cycle = elapsed % 12;
  const phase = cycle < 4 ? phases[0] : cycle < 6 ? phases[1] : phases[2];

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running, remaining]);

  useEffect(() => {
    if (!voice || !running || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (cycle === 0 || cycle === 4 || cycle === 6) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phase.label);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [cycle, phase.label, running, voice]);

  function reset() {
    setRunning(false);
    setRemaining(TOTAL);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Ride the wave</p>
        <CardTitle>A little space for this moment</CardTitle>
        <CardDescription>Urges rise and fall. You don&apos;t have to act on one right now.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center rounded-2xl bg-background px-5 py-8 text-center">
          <div className="relative flex h-44 w-44 items-center justify-center">
            <div className={`breathe-orb absolute h-36 w-36 rounded-full bg-primary/20 ${running ? "" : "[animation-play-state:paused]"}`} />
            <div className="relative">
              <p aria-live="polite" className="font-display text-2xl">{remaining === 0 ? "You did it" : running ? phase.label : "Ready when you are"}</p>
              <p className="mt-1 text-2xl tabular-nums text-muted-foreground">{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</p>
            </div>
          </div>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">Follow the gentle rhythm: breathe in for four, pause for two, breathe out for six. Stop any time.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button onClick={() => setRunning((value) => !value)} disabled={remaining === 0}>
              {running ? <Pause size={16} /> : <Play size={16} />}{running ? "Pause" : remaining === 0 ? "Finished" : "Begin"}
            </Button>
            <Button variant="outline" onClick={reset}><RotateCcw size={15} /> Start over</Button>
            <Button
              variant="ghost"
              onClick={() => setVoice((value) => !value)}
              aria-label={voice ? "Turn off voice guidance" : "Turn on voice guidance"}
              title={typeof window !== "undefined" && !("speechSynthesis" in window) ? "Voice guidance is not available in this browser" : "Voice guidance"}
            >
              {voice ? <Volume2 size={17} /> : <VolumeX size={17} />}<span className="text-xs">Voice</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
