-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
