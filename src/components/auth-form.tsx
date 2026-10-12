"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isRegister = mode === "register";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const body = Object.fromEntries(data.entries());
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Something went wrong. Please try again.");
      router.push("/dashboard");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-12 inline-flex items-center gap-2 text-primary">
            <Sprout size={23} /> <span className="font-display text-xl font-semibold text-foreground">Steady</span>
          </Link>
          <p className="mb-3 text-sm font-medium uppercase tracking-[.15em] text-primary">
            {isRegister ? "A fresh start, on your terms" : "Welcome back"}
          </p>
          <h1 className="font-display text-4xl leading-tight">
            {isRegister ? "Make room for a new day." : "Good to see you again."}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {isRegister ? "A private space to notice progress, find support, and take the next small step." : "Pick up where you left off. There is no perfect way to do this."}
          </p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            {isRegister ? (
              <div className="space-y-2">
                <Label htmlFor="displayName">What should we call you?</Label>
                <Input id="displayName" name="displayName" autoComplete="name" maxLength={60} required />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" name="email" type="email" autoComplete="email" maxLength={254} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                minLength={isRegister ? 12 : 1}
                maxLength={128}
                required
              />
              {isRegister ? <p className="text-xs text-muted-foreground">Use at least 12 characters.</p> : null}
            </div>
            {error ? <p role="alert" className="text-sm text-rose">{error}</p> : null}
            <Button className="w-full" size="lg" type="submit" disabled={busy}>
              {busy ? "One moment..." : isRegister ? "Create my space" : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isRegister ? "Already have a space?" : "New here?"}{" "}
            <Link className="font-medium text-primary underline-offset-4 hover:underline" href={isRegister ? "/login" : "/register"}>
              {isRegister ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>
      </section>
      <aside className="relative hidden overflow-hidden bg-[#e7eee6] p-12 dark:bg-[#24332b] lg:flex lg:items-end">
        <div className="absolute -right-20 -top-24 h-[32rem] w-[32rem] rounded-full border border-primary/15" />
        <div className="absolute right-8 top-16 h-[23rem] w-[23rem] rounded-full border border-primary/20" />
        <div className="relative max-w-lg pb-8">
          <p className="font-display text-4xl leading-snug">“The next right thing can be very small.”</p>
          <p className="mt-5 text-muted-foreground">Gentle tools for the days that ask a little more of you.</p>
        </div>
      </aside>
    </main>
  );
}
