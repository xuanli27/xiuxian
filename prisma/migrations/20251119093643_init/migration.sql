/*
  Warnings:

  - The primary key for the `leaderboard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contribution` on the `leaderboard` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `leaderboard` table. All the data in the column will be lost.
  - You are about to drop the column `season` on the `leaderboard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playerId,seasonId]` on the table `leaderboard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seasonId` to the `leaderboard` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "leaderboard_playerId_season_key";

-- DropIndex
DROP INDEX "leaderboard_season_score_idx";

-- AlterTable
ALTER TABLE "leaderboard" DROP CONSTRAINT "leaderboard_pkey",
DROP COLUMN "contribution",
DROP COLUMN "score",
DROP COLUMN "season",
ADD COLUMN     "contributionScore" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "playerAvatar" TEXT,
ADD COLUMN     "powerScore" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "realmScore" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "seasonId" TEXT NOT NULL,
ADD COLUMN     "wealthScore" BIGINT NOT NULL DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "leaderboard_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "leaderboard_id_seq";

-- CreateTable
CREATE TABLE "sects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "leaderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sect_members" (
    "id" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "sectId" TEXT NOT NULL,
    "rank" "SectRank" NOT NULL DEFAULT 'OUTER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sect_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sects_name_key" ON "sects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sects_leaderId_key" ON "sects"("leaderId");

-- CreateIndex
CREATE UNIQUE INDEX "sect_members_playerId_key" ON "sect_members"("playerId");

-- CreateIndex
CREATE INDEX "leaderboard_seasonId_realmScore_idx" ON "leaderboard"("seasonId", "realmScore");

-- CreateIndex
CREATE INDEX "leaderboard_seasonId_powerScore_idx" ON "leaderboard"("seasonId", "powerScore");

-- CreateIndex
CREATE INDEX "leaderboard_seasonId_wealthScore_idx" ON "leaderboard"("seasonId", "wealthScore");

-- CreateIndex
CREATE INDEX "leaderboard_seasonId_contributionScore_idx" ON "leaderboard"("seasonId", "contributionScore");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboard_playerId_seasonId_key" ON "leaderboard"("playerId", "seasonId");

-- AddForeignKey
ALTER TABLE "sect_members" ADD CONSTRAINT "sect_members_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sect_members" ADD CONSTRAINT "sect_members_sectId_fkey" FOREIGN KEY ("sectId") REFERENCES "sects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
