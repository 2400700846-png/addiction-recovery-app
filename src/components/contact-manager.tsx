"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Phone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Contact = { id: string; name: string; phone: string; role: "SPONSOR" | "THERAPIST" | "FAMILY" };

export function ContactManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Contact["role"]>("SPONSOR");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const response = await fetch("/api/emergency/contacts");
    const result = (await response.json()) as { contacts?: Contact[]; error?: string };
    if (!response.ok) throw new Error(result.error ?? "Couldn't load your contacts.");
    setContacts(result.contacts ?? []);
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/emergency/contacts", { signal: controller.signal })
      .then(async (response) => {
        const result = (await response.json()) as { contacts?: Contact[]; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Couldn't load your contacts.");
        setContacts(result.contacts ?? []);
      })
      .catch((reason: unknown) => {
        if (reason instanceof Error && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Couldn't load your contacts.");
      });
    return () => controller.abort();
  }, []);

  async function addContact(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/emergency/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, role }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Couldn't add this contact.");
      setName("");
      setPhone("");
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn't add this contact.");
    } finally {
      setBusy(false);
    }
  }

  async function removeContact(id: string) {
    setError("");
    try {
      const response = await fetch(`/api/emergency/contacts?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Couldn't remove this contact.");
      setContacts((current) => current.filter((item) => item.id !== id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn't remove this contact.");
    }
  }

  return (
    <div className="space-y-5">
      {contacts.length ? (
        <ul className="space-y-2">
          {contacts.map((contact) => (
            <li key={contact.id} className="flex items-center justify-between gap-3 rounded-xl bg-background p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{contact.name}</p>
                <p className="text-xs text-muted-foreground">{contact.role.charAt(0) + contact.role.slice(1).toLowerCase()} · {contact.phone}</p>
              </div>
              <div className="flex items-center gap-1">
                <a aria-label={`Call ${contact.name}`} className="rounded-lg p-2 text-primary hover:bg-accent" href={`tel:${contact.phone}`}><Phone size={16} /></a>
                <button aria-label={`Remove ${contact.name}`} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" onClick={() => removeContact(contact.id)}><Trash2 size={15} /></button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl bg-background p-4 text-sm text-muted-foreground">Your trusted contacts will appear here when you add them.</p>
      )}
      <form onSubmit={addContact} className="space-y-3 border-t border-border pt-4">
        <p className="text-sm font-medium">Add someone in your corner</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="contact-name">Name</Label><Input id="contact-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required /></div>
          <div className="space-y-1.5"><Label htmlFor="contact-phone">Phone</Label><Input id="contact-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={30} required /></div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-role">Their role</Label>
          <select id="contact-role" value={role} onChange={(event) => setRole(event.target.value as Contact["role"])} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
            <option value="SPONSOR">Sponsor</option><option value="THERAPIST">Therapist</option><option value="FAMILY">Family or friend</option>
          </select>
        </div>
        {error ? <p role="alert" className="text-sm text-rose">{error}</p> : null}
        <Button type="submit" variant="outline" disabled={busy}><Plus size={15} /> {busy ? "Adding..." : "Add contact"}</Button>
      </form>
    </div>
  );
}
