import { normalizeUsername } from "../normalizers/username.normalizer.js";

export function emailGenerator(username: string): string {
  if (!username.trim()) {
    throw new Error("Username can't be empty");
  }

  const normalized = normalizeUsername(username);

  if (!normalized) {
    throw new Error("Username is invalid");
  }

  return `${normalized}@gmail.com`;
}
