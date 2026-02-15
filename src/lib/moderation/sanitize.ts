const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function sanitizeSearch(input: string): string {
  return input.replace(/[,.()"'\\%_]/g, "").trim();
}

export function safeOffset(input: string | null): number {
  return Math.max(0, parseInt(input || "0") || 0);
}

export function safeLimit(input: string | null, max = 100): number {
  return Math.min(Math.max(1, parseInt(input || "50") || 50), max);
}

export function isValidUUID(input: string): boolean {
  return UUID_REGEX.test(input);
}
