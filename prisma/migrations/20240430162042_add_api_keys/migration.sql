/*
  Warnings:

  - You are about to drop the column `credits` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usedCredits" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "credits";

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "valid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
