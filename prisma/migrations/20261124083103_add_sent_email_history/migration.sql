-- CreateTable
CREATE TABLE "SentEmail" (
    "id" SERIAL NOT NULL,
    "smtpAccountId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SentEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SentEmail_email_idx" ON "SentEmail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SentEmail_username_smtpAccountId_key" ON "SentEmail"("username", "smtpAccountId");

-- AddForeignKey
ALTER TABLE "SentEmail" ADD CONSTRAINT "SentEmail_smtpAccountId_fkey" FOREIGN KEY ("smtpAccountId") REFERENCES "SMTPAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
