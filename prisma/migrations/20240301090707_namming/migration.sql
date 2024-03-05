/*
  Warnings:

  - You are about to drop the column `studentId` on the `Assignments` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `Assignments` table. All the data in the column will be lost.
  - You are about to drop the `Students` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dueDate` to the `Assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `Assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalScore` to the `Assignments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'TEACHER');

-- DropForeignKey
ALTER TABLE "Assignments" DROP CONSTRAINT "Assignments_studentId_fkey";

-- AlterTable
ALTER TABLE "Assignments" DROP COLUMN "studentId",
DROP COLUMN "submittedAt",
ADD COLUMN     "classroomsId" INTEGER,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "teacherId" INTEGER NOT NULL,
ADD COLUMN     "totalScore" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Students";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classrooms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "Classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAssignmentSubmissions" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "submissionUrl" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StudentAssignmentSubmissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_token_key" ON "Users"("token");

-- AddForeignKey
ALTER TABLE "Classrooms" ADD CONSTRAINT "Classrooms_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignments" ADD CONSTRAINT "Assignments_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignments" ADD CONSTRAINT "Assignments_classroomsId_fkey" FOREIGN KEY ("classroomsId") REFERENCES "Classrooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAssignmentSubmissions" ADD CONSTRAINT "StudentAssignmentSubmissions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAssignmentSubmissions" ADD CONSTRAINT "StudentAssignmentSubmissions_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
