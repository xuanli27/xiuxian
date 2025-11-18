/*
  Warnings:

  - The primary key for the `tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "TaskDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('DAILY', 'WEEKLY', 'ACHIEVEMENT');

-- AlterTable
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_pkey",
ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "category" "TaskCategory" NOT NULL DEFAULT 'DAILY',
ADD COLUMN     "difficulty" "TaskDifficulty" NOT NULL DEFAULT 'EASY',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tasks_id_seq";
