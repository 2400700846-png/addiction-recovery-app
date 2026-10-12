export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(value);
}

export function parseStringArray(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string")
      ? (parsed as string[])
      : [];
  } catch {
    return [];
  }
}

type ClassValue = string | null | undefined | false | Record<string, boolean>;

export function cn(...values: ClassValue[]) {
  return values
    .flatMap((value) => {
      if (!value) return [];
      if (typeof value === "string") return [value];
      return Object.entries(value)
        .filter(([, enabled]) => enabled)
        .map(([name]) => name);
    })
    .join(" ");
}
