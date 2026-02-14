CREATE TYPE "ChatRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

CREATE TABLE "ChatConversation" (
    "id" TEXT PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "visitorIp" TEXT,
    "isPartner" BOOLEAN NOT NULL DEFAULT false,
    "partnerId" TEXT,
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "lastMessageAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "escalatedAt" TIMESTAMP WITH TIME ZONE,
    "escalationReason" TEXT,
    "metadata" JSONB
);

CREATE INDEX "ChatConversation_sessionId_idx" ON "ChatConversation"("sessionId");
CREATE INDEX "ChatConversation_visitorIp_idx" ON "ChatConversation"("visitorIp");
CREATE INDEX "ChatConversation_isPartner_idx" ON "ChatConversation"("isPartner");
CREATE INDEX "ChatConversation_startedAt_idx" ON "ChatConversation"("startedAt");
CREATE INDEX "ChatConversation_escalatedAt_idx" ON "ChatConversation"("escalatedAt");

CREATE TABLE "ChatMessage" (
    "id" TEXT PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "role" "ChatRole" NOT NULL,
    "content" TEXT NOT NULL,
    "tokensUsed" INTEGER,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ChatConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ChatMessage_conversationId_idx" ON "ChatMessage"("conversationId");
CREATE INDEX "ChatMessage_createdAt_idx" ON "ChatMessage"("createdAt");

CREATE TABLE "ChatRateLimit" (
    "id" TEXT PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "windowStart" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "isPartner" BOOLEAN NOT NULL DEFAULT false
);

CREATE UNIQUE INDEX "ChatRateLimit_identifier_key" ON "ChatRateLimit"("identifier");
CREATE INDEX "ChatRateLimit_identifier_idx" ON "ChatRateLimit"("identifier");
CREATE INDEX "ChatRateLimit_windowStart_idx" ON "ChatRateLimit"("windowStart");
