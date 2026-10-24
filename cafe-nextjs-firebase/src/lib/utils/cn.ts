type ClassValue = string | number | false | null | undefined;

/** Minimal class-name joiner (keeps the dependency list short). */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
