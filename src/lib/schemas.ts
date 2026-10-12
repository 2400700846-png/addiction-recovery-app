import { z } from "zod";

export const registerSchema = z.object({
  displayName: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export const cravingSchema = z.object({
  intensity: z.number().int().min(1).max(10),
  internalTriggers: z.array(z.string().trim().min(1).max(50)).max(12),
  externalTriggers: z.array(z.string().trim().min(1).max(50)).max(12),
  copingStrategies: z.array(z.string().trim().min(1).max(50)).max(12),
  hungry: z.boolean(),
  angry: z.boolean(),
  lonely: z.boolean(),
  tired: z.boolean(),
  notes: z.string().max(2000),
});

export const clockSchema = z.object({
  startDate: z.coerce.date().refine((date) => date <= new Date(), "Start date cannot be in the future."),
  target: z.string().trim().min(1).max(80),
  moneySavedPerDay: z.number().min(0).max(100000),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(3).max(30).regex(/^[+\d().\-\s]+$/),
  role: z.enum(["SPONSOR", "THERAPIST", "FAMILY"]),
});

export const pinSchema = z.object({ pin: z.string().min(6).max(128) });
