-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('MORTAL', 'QI_REFINING', 'FOUNDATION', 'GOLDEN_CORE', 'NASCENT_SOUL', 'SPIRIT_SEVERING', 'VOID_REFINING', 'MAHAYANA', 'IMMORTAL');

-- CreateEnum
CREATE TYPE "SectRank" AS ENUM ('OUTER', 'INNER', 'ELITE', 'ELDER', 'MASTER');

-- CreateEnum
CREATE TYPE "SpiritRootType" AS ENUM ('HEAVEN', 'EARTH', 'HUMAN', 'WASTE');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('LINK', 'GAME', 'BATTLE');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('MAJOR', 'MINOR', 'CHAIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "rank" "Rank" NOT NULL DEFAULT 'MORTAL',
    "sectRank" "SectRank" NOT NULL DEFAULT 'OUTER',
    "level" INTEGER NOT NULL DEFAULT 1,
    "qi" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxQi" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "spiritRoot" "SpiritRootType" NOT NULL DEFAULT 'WASTE',
    "mindState" TEXT NOT NULL DEFAULT '刚入职',
    "innerDemon" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "contribution" INTEGER NOT NULL DEFAULT 0,
    "spiritStones" INTEGER NOT NULL DEFAULT 0,
    "caveLevel" INTEGER NOT NULL DEFAULT 1,
    "inventory" JSONB NOT NULL DEFAULT '{}',
    "equipped" JSONB NOT NULL DEFAULT '{}',
    "materials" JSONB NOT NULL DEFAULT '{}',
    "history" JSONB NOT NULL DEFAULT '[]',
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TaskType" NOT NULL,
    "rewardQi" INTEGER NOT NULL,
    "rewardContribution" INTEGER NOT NULL,
    "rewardStones" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "url" TEXT,
    "quiz" JSONB,
    "enemy" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboard" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "playerName" TEXT NOT NULL,
    "rank" "Rank" NOT NULL,
    "level" INTEGER NOT NULL,
    "contribution" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "season" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_logs" (
    "id" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "choiceId" TEXT,
    "choiceText" TEXT,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_status_effects" (
    "id" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "effectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "modifiers" JSONB NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "player_status_effects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "players_userId_key" ON "players"("userId");

-- CreateIndex
CREATE INDEX "players_rank_level_idx" ON "players"("rank", "level");

-- CreateIndex
CREATE INDEX "tasks_playerId_status_idx" ON "tasks"("playerId", "status");

-- CreateIndex
CREATE INDEX "leaderboard_season_score_idx" ON "leaderboard"("season", "score");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboard_playerId_season_key" ON "leaderboard"("playerId", "season");

-- CreateIndex
CREATE INDEX "event_logs_playerId_createdAt_idx" ON "event_logs"("playerId", "createdAt");

-- CreateIndex
CREATE INDEX "player_status_effects_playerId_expiresAt_idx" ON "player_status_effects"("playerId", "expiresAt");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_status_effects" ADD CONSTRAINT "player_status_effects_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
