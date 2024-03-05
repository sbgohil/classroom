/*
  Warnings:

  - You are about to drop the column `classroomsId` on the `Assignments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assignments" DROP CONSTRAINT "Assignments_classroomsId_fkey";

-- AlterTable
ALTER TABLE "Assignments" DROP COLUMN "classroomsId",
ADD COLUMN     "classroomId" INTEGER;

-- AddForeignKey
ALTER TABLE "Assignments" ADD CONSTRAINT "Assignments_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classrooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
