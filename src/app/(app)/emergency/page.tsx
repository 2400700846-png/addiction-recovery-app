import { EmergencyPanel } from "@/components/emergency-panel";

export default function EmergencyPage() {
  return (
    <div className="space-y-6">
      <div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">You are not alone</p><h1 className="mt-2 font-display text-3xl sm:text-4xl">Support, when you need it</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Keep trusted people close and find a grounding exercise for a hard moment.</p></div>
      <EmergencyPanel />
    </div>
  );
}
