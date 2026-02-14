CREATE TYPE "DonationFrequency" AS ENUM ('ONE_TIME', 'MONTHLY');
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELED', 'REFUNDED');

CREATE TABLE "Donation" (
    "id" TEXT PRIMARY KEY,
    "donorId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "frequency" "DonationFrequency" NOT NULL DEFAULT 'ONE_TIME',
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX "Donation_stripeCheckoutSessionId_key" ON "Donation"("stripeCheckoutSessionId");
CREATE INDEX "Donation_donorId_idx" ON "Donation"("donorId");
CREATE INDEX "Donation_status_idx" ON "Donation"("status");
CREATE INDEX "Donation_frequency_idx" ON "Donation"("frequency");
CREATE INDEX "Donation_stripeCheckoutSessionId_idx" ON "Donation"("stripeCheckoutSessionId");

ALTER TABLE "Donation"
    ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
