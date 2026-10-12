"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { count: 5, sense: "things you can see", prompt: "Look around gently. Name five things you can see." },
  { count: 4, sense: "things you can feel", prompt: "Notice four things you can feel against your skin." },
  { count: 3, sense: "things you can hear", prompt: "Listen for three sounds, near or far." },
  { count: 2, sense: "things you can smell", prompt: "Find two scents, or imagine two comforting ones." },
  { count: 1, sense: "thing you can taste", prompt: "Notice one taste, or take a slow sip of water." },
];

export function GroundingGuide() {
  const [step, setStep] = useState(0);
  const complete = step >= steps.length;
  const current = steps[Math.min(step, steps.length - 1)];

  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Come back to now</p>
        <CardTitle>5–4–3–2–1 grounding</CardTitle>
        <CardDescription>Take your time. There is no need to get this exactly right.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl bg-background p-6 text-center">
          {complete ? (
            <>
              <p className="font-display text-2xl">You are here, in this moment.</p>
              <p className="mt-2 text-sm text-muted-foreground">Notice how your body feels now. You can repeat the exercise or choose what comes next.</p>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent font-display text-3xl text-primary">{current.count}</div>
              <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Step {step + 1} of 5 · {current.sense}</p>
              <p className="mt-2 font-display text-xl">{current.prompt}</p>
            </>
          )}
          <div className="mt-6 flex justify-center gap-2">
            {step > 0 && step < steps.length ? <Button variant="outline" onClick={() => setStep((value) => value - 1)}><ArrowLeft size={15} /> Back</Button> : null}
            {complete ? (
              <Button variant="outline" onClick={() => setStep(0)}><RotateCcw size={15} /> Do it again</Button>
            ) : (
              <Button onClick={() => setStep((value) => value + 1)}>I&apos;m ready <ArrowRight size={15} /></Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
