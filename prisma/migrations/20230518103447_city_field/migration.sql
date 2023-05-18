/*
  Warnings:

  - Added the required column `city` to the `MetaborgBurnUsers` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `vote` on the `Vote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MetaborgBurnUsers" ADD COLUMN     "city" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "vote",
ADD COLUMN     "vote" TEXT NOT NULL;

-- DropEnum
DROP TYPE "VoteValue";

-- CreateIndex
CREATE INDEX "Vote_userId_collectionId_createdAt_updatedAt_vote_idx" ON "Vote"("userId", "collectionId", "createdAt", "updatedAt", "vote");
