-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "recoveryStartDate" DATETIME,
    "discreetMode" BOOLEAN NOT NULL DEFAULT false,
    "detailPinHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SobrietyClock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "target" TEXT NOT NULL,
    "moneySavedPerDay" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SobrietyClock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CravingLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,
    "internalTriggers" TEXT NOT NULL DEFAULT '[]',
    "externalTriggers" TEXT NOT NULL DEFAULT '[]',
    "copingStrategies" TEXT NOT NULL DEFAULT '[]',
    "hungry" BOOLEAN NOT NULL DEFAULT false,
    "angry" BOOLEAN NOT NULL DEFAULT false,
    "lonely" BOOLEAN NOT NULL DEFAULT false,
    "tired" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CravingLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmergencyContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SobrietyClock_userId_key" ON "SobrietyClock"("userId");

-- CreateIndex
CREATE INDEX "CravingLog_userId_createdAt_idx" ON "CravingLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "EmergencyContact_userId_priority_idx" ON "EmergencyContact"("userId", "priority");
