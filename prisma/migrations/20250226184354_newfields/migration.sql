-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('PENDING', 'INPROGRESS', 'FINISHED', 'CANCELED');

-- CreateEnum
CREATE TYPE "MarketingOptions" AS ENUM ('SocialMediaPosts', 'InPersonAppearances');

-- CreateEnum
CREATE TYPE "Compensations" AS ENUM ('InKind', 'FixedFee', 'Commission');

-- CreateTable
CREATE TABLE "StudentAthlete" (
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "age" INTEGER NOT NULL,
    "sport" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "ethnicity" TEXT NOT NULL,
    "introBlurb" TEXT,
    "instagram" TEXT,
    "tiktok" TEXT,
    "pinterest" TEXT,
    "linkedIn" TEXT,
    "twitter" TEXT,
    "industries" TEXT[],
    "marketingOptions" "MarketingOptions"[],
    "hoursPerWeek" INTEGER,
    "compensation" "Compensations"[],
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAthlete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "missionStatement" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "instagram" TEXT,
    "tiktok" TEXT,
    "pinterest" TEXT,
    "linkedIn" TEXT,
    "twitter" TEXT,
    "website" TEXT,
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "name" TEXT NOT NULL,
    "campaignSummary" TEXT NOT NULL,
    "maxBudget" TEXT NOT NULL,
    "compensation" "Compensations" NOT NULL,
    "studentAthleteCount" INTEGER NOT NULL,
    "sports" TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "objectives" TEXT NOT NULL,
    "targetAudienceMin" INTEGER NOT NULL,
    "targetAudienceMax" INTEGER NOT NULL,
    "athleteIntegration" TEXT NOT NULL,
    "channels" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "budgetBreakdown" TEXT NOT NULL,
    "creativeConcept" TEXT NOT NULL,
    "brandTone" TEXT NOT NULL,
    "influencerAngle" TEXT NOT NULL,
    "brandMentions" TEXT NOT NULL,
    "metrics" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "productLaunch" BOOLEAN NOT NULL,
    "engagementGoal" INTEGER,
    "conversionGoal" INTEGER,
    "impressionsGoal" INTEGER,
    "contentDeliverables" TEXT,
    "eventPromotion" BOOLEAN NOT NULL,
    "csrInitiative" BOOLEAN NOT NULL,
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "businessId" INTEGER NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudentAthleteCampaign" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_StudentAthleteCampaign_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentAthlete_email_key" ON "StudentAthlete"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Business_email_key" ON "Business"("email");

-- CreateIndex
CREATE INDEX "_StudentAthleteCampaign_B_index" ON "_StudentAthleteCampaign"("B");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentAthleteCampaign" ADD CONSTRAINT "_StudentAthleteCampaign_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentAthleteCampaign" ADD CONSTRAINT "_StudentAthleteCampaign_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentAthlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
