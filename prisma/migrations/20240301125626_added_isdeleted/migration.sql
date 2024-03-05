-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "Assignments" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Classrooms" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "StudentAssignmentSubmissions" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;
