"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Activity, AlarmClock, LayoutDashboard, Settings, Shield, Sparkles } from "lucide-react";
import { Header } from "@/components/header";

type PrivacyContextValue = { discreet: boolean };
const PrivacyContext = createContext<PrivacyContextValue>({ discreet: false });

export function usePrivacyMode() {
  return useContext(PrivacyContext);
}

const routes = [
  { href: "/dashboard", label: "Today", discreetLabel: "Overview", icon: LayoutDashboard },
  { href: "/cravings", label: "Cravings", discreetLabel: "Check-ins", icon: Activity },
  { href: "/emergency", label: "Get support", discreetLabel: "Get support", icon: Shield },
  { href: "/settings", label: "Settings", discreetLabel: "Settings", icon: Settings },
];

export function AppShell({
  children,
  initialDiscreet,
  displayName,
}: {
  children: ReactNode;
  initialDiscreet: boolean;
  displayName: string;
}) {
  const [discreet, setDiscreet] = useState(initialDiscreet);
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <PrivacyContext.Provider value={{ discreet }}>
      <div className="min-h-screen">
        <Header discreet={discreet} onDiscreetChange={setDiscreet} onSignOut={signOut} />
        <div className="mx-auto flex max-w-7xl gap-8 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-8">
              <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[.15em] text-muted-foreground">
                {discreet ? "Your space" : "Your recovery"}
              </p>
              <nav className="space-y-1">
                {routes.map(({ href, label, discreetLabel, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                        active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon size={17} strokeWidth={1.8} />
                      {discreet ? discreetLabel : label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-10 rounded-2xl bg-[#e9eee8] p-4 text-sm dark:bg-[#25352c]">
                <Sparkles size={17} className="mb-3 text-sage" />
                <p className="font-medium">{discreet ? "One moment at a time." : "Progress has many shapes."}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {discreet ? "Small steps still count." : "You can begin again with kindness, any time."}
                </p>
              </div>
              <p className="mt-6 px-3 text-xs text-muted-foreground">
                {displayName ? `Here with you, ${displayName}` : "Here with you"}
              </p>
              <button onClick={signOut} className="mt-2 flex items-center gap-2 px-3 text-xs text-muted-foreground hover:text-foreground">
                <AlarmClock size={14} /> Sign out
              </button>
            </div>
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
        <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur lg:hidden">
          {routes.slice(0, 3).map(({ href, label, discreetLabel, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] transition-colors ${pathname === href ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Icon size={19} />
              {discreet ? discreetLabel : label}
            </Link>
          ))}
        </nav>
      </div>
    </PrivacyContext.Provider>
  );
}
