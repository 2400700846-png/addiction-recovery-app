import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Heart, ShieldCheck, Sparkles, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth";

export default async function HomePage() {
  if (await getSessionUser()) redirect("/dashboard");
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <span className="font-display text-xl font-semibold text-foreground">Steady</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login"><Button variant="ghost">Sign in</Button></Link>
          <Link href="/register"><Button size="sm">Get started</Button></Link>
        </div>
      </header>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:pb-28 lg:pt-20">
        <div className="relative z-10">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary">
             Recovery, at your pace
          </p>
          <h1 className="max-w-2xl font-display text-5xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            A little steadier, <span className="text-primary">one day at a time.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            A private, compassionate place to track your progress, understand urges, and reach for support when you need it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register"><Button size="lg">Start your space <ArrowRight size={17} /></Button></Link>
            <Link href="/login"><Button size="lg" variant="outline">I have an account</Button></Link>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">Your journey belongs to you. No judgment, just support.</p>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-5 rounded-[3rem] bg-[#e8eee8] dark:bg-[#1d3028]" />
          <div className="relative rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">A moment to notice</span>
              <Heart size={19} className="text-rose" />
            </div>
            <p className="mt-8 font-display text-3xl">You made it here.</p>
            <p className="mt-2 text-sm text-muted-foreground">That counts. What would feel helpful right now?</p>
            <div className="mt-7 space-y-3">
              {["Take one slow breath", "Check in with how I feel", "Reach out to someone"].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-background p-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary">{index + 1}</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck size={15} /> Your private space, on your terms
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
