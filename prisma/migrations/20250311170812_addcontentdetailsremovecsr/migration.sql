/*
  Warnings:

  - You are about to drop the column `csrInitiative` on the `Campaign` table. All the data in the column will be lost.
  - Added the required column `contentDetails` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Made the column `engagementGoal` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conversionGoal` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `impressionsGoal` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contentDeliverables` on table `Campaign` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "csrInitiative",
ADD COLUMN     "contentDetails" TEXT NOT NULL,
ALTER COLUMN "engagementGoal" SET NOT NULL,
ALTER COLUMN "conversionGoal" SET NOT NULL,
ALTER COLUMN "impressionsGoal" SET NOT NULL,
ALTER COLUMN "contentDeliverables" SET NOT NULL;
