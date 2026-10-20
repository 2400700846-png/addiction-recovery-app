"use client";

import { useEffect, useState } from "react";
import { Phone, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactManager } from "@/components/contact-manager";
import { GroundingGuide } from "@/components/grounding-guide";
import { usePrivacyMode } from "@/components/app-shell";

type Contact = { id: string; name: string; phone: string; role: string };

export function EmergencyPanel() {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState("");
  const { discreet } = usePrivacyMode();

  useEffect(() => {
    fetch("/api/emergency/contacts")
      .then(async (response) => {
        const data = (await response.json()) as { contacts?: Contact[]; error?: string };
        if (!response.ok) throw new Error(data.error ?? "Couldn't load support contacts.");
        setContacts(data.contacts ?? []);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Couldn't load support contacts."));
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-rose/30 bg-[#fbf2f0] dark:bg-[#382927]">
        <CardContent className="flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-4 text-rose"><p className="text-xs font-semibold uppercase tracking-[.15em]">You don&apos;t have to handle this alone</p></div>
            <h2 className="mt-3 font-display text-2xl">{discreet ? "Need a hand right now?" : "Need immediate support?"}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Connect with a trusted person, or use a crisis resource. In Uganda, call 999 for emergency services; outside Uganda, call your local emergency number.</p>
          </div>
          <Button variant="destructive" size="lg" className="shrink-0" onClick={() => setOpen(true)}><Phone size={17} /> Get help now</Button>
        </CardContent>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>People in your corner</CardTitle><CardDescription>Add someone you trust so their call and message links are ready when you need them.</CardDescription></CardHeader>
          <CardContent><ContactManager /></CardContent>
        </Card>
        <GroundingGuide />
      </div>
      <Card>
        <CardHeader><CardTitle>A note about urgent help</CardTitle></CardHeader>
        <CardContent className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <Shield className="mt-0.5 shrink-0 text-primary" size={18} />
          <p>In Uganda, call <a className="font-semibold text-primary underline" href="tel:999">999</a> for ambulance, fire, or police emergencies. Emergency services may not accept text messages; use a trusted contact&apos;s text link if you need to message someone. Outside Uganda, call your local emergency number. This app is not monitored and cannot dispatch emergency help.</p>
        </CardContent>
      </Card>
      {error ? <p role="alert" className="text-sm text-rose">{error}</p> : null}
      {open ? (
        <div role="dialog" aria-modal="true" aria-labelledby="sos-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[.15em] text-rose">Right now</p><h2 id="sos-title" className="mt-2 font-display text-2xl">Reach for a real person</h2></div>
              <button onClick={() => setOpen(false)} aria-label="Close support options" className="rounded-lg p-2 hover:bg-muted"><X size={18} /></button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">If you may hurt yourself or someone else, get immediate, human support. In Uganda, call 999 for emergency services; outside Uganda, call your local emergency number.</p>
            <div className="mt-5 grid gap-2">
              <a className="flex items-center justify-between rounded-xl bg-rose px-4 py-3 text-sm font-semibold text-white" href="tel:999"><span>Call 999 (Uganda emergency services)</span><Phone size={17} /></a>
              {contacts.map((contact) => (
                <div key={contact.id} className="rounded-xl border border-border p-3">
                  <p className="text-sm font-medium">{contact.name} <span className="font-normal text-muted-foreground">· {contact.role.toLowerCase()}</span></p>
                  <div className="mt-2 flex gap-2">
                    <a className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-foreground" href={`tel:${contact.phone}`}><Phone size={14} /> Call</a>
                    <a className="flex flex-1 items-center justify-center rounded-lg border border-border px-3 py-2 text-xs font-medium" href={`sms:${contact.phone}`}>Text</a>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">999 is Uganda&apos;s emergency number for ambulance, fire, and police. It may not accept text messages; use a trusted contact&apos;s text link instead. Outside Uganda, call your local emergency number.</p>
            <Button className="mt-5 w-full" variant="outline" onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
