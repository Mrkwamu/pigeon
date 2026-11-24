import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is not configured");
}

const KEY = Buffer.from(ENCRYPTION_KEY, "base64");

if (KEY.length !== 32) {
  throw new Error("ENCRYPTION_KEY must decode to exactly 32 bytes");
}

const ALGORITHM = "aes-256-gcm";

export function encrypt(text: string): string {
  const iv = randomBytes(12);

  const cipher = createCipheriv(ALGORITHM, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

export function decrypt(encryptedText: string): string {
  const [ivString, authTagString, encryptedString] = encryptedText.split(":");

  if (!ivString || !authTagString || !encryptedString) {
    throw new Error("Invalid encrypted data format");
  }

  const iv = Buffer.from(ivString, "base64");
  const authTag = Buffer.from(authTagString, "base64");
  const encrypted = Buffer.from(encryptedString, "base64");

  if (iv.length !== 12 || authTag.length !== 16) {
    throw new Error("Invalid encrypted data");
  }

  const decipher = createDecipheriv(ALGORITHM, KEY, iv);

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
