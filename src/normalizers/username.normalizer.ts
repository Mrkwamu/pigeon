export function normalizeUsername(username: string): string {
  return username
    .trim()
    .replace(/^@/, "")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9.]/g, "");
}
