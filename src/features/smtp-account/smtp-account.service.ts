import prisma from "../../config/prisma.js";
import { encrypt } from "../../utils/encryption.js";
import type { CreateSMTPAccountInput } from "./smtp-account.types.js";

async function checkSMTPAccount(email: string) {
  return await prisma.sMTPAccount.findUnique({
    where: {
      email,
    },
  });
}

export async function createSMTPAccount(data: CreateSMTPAccountInput) {
  const email = data.email?.trim().toLowerCase();

  if (!email) {
    throw new Error("Please enter your email");
  }

  if (typeof data.pass !== "string" || !data.pass.length) {
    throw new Error("Enter your app password");
  }

  const isExisting = await checkSMTPAccount(email);

  if (isExisting) {
    return "Account already added";
  }

  const pass = data.pass.replace(/\s+/g, "");
  const encryptedPass = encrypt(pass);

  const account = await prisma.sMTPAccount.create({
    data: {
      email,
      encryptedPass,
    },
    select: {
      id: true,
      email: true,
    },
  });

  return account;
}

export async function getSMTPAccount(id: number) {
  const account = await prisma.sMTPAccount.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      encryptedPass: true,
    },
  });

  if (!account) {
    throw new Error("SMTP account not found");
  }

  return account;
}

export async function getSMTPAccounts() {
  return prisma.sMTPAccount.findMany({
    select: {
      id: true,
      email: true,
    },
    orderBy: {
      id: "desc",
    },
  });
}

export async function updateSMTPAccountPassword(
  emailInput: string,
  passInput: string,
) {
  const email = emailInput.trim().toLowerCase();

  if (!email) {
    throw new Error("Please enter your email");
  }

  if (typeof passInput !== "string" || !passInput.trim()) {
    throw new Error("Please enter your app password");
  }

  const account = await prisma.sMTPAccount.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  if (!account) {
    throw new Error("SMTP account not found");
  }

  const pass = passInput.replace(/\s+/g, "");
  const encryptedPass = encrypt(pass);

  await prisma.sMTPAccount.update({
    where: { id: account.id },
    data: { encryptedPass },
  });

  return {
    id: account.id,
    email: account.email,
  };
}
