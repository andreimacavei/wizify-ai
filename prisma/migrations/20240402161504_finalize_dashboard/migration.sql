/*
  Warnings:

  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `plan` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripeId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripePrice` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `usedCredits` on the `Subscription` table. All the data in the column will be lost.
  - The `id` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `planId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "domains" DROP CONSTRAINT "domains_userId_fkey";

-- AlterTable
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_pkey",
DROP COLUMN "plan",
DROP COLUMN "status",
DROP COLUMN "stripeId",
DROP COLUMN "stripePrice",
DROP COLUMN "usedCredits",
ADD COLUMN     "planId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeKey" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "subscriptionId" INTEGER,
ALTER COLUMN "credits" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "domains" ADD COLUMN     "usage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "validated" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserKey" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "domainsAllowed" INTEGER NOT NULL,
    "creditsPerMonth" INTEGER NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserKey_key_key" ON "UserKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");

-- AddForeignKey
ALTER TABLE "UserKey" ADD CONSTRAINT "UserKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
