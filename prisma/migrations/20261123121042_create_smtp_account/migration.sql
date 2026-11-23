-- CreateTable
CREATE TABLE "SMTPAccount" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "encryptedPass" TEXT NOT NULL,

    CONSTRAINT "SMTPAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SMTPAccount_email_key" ON "SMTPAccount"("email");
