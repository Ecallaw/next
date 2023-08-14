-- DropForeignKey
ALTER TABLE "EntryScore" DROP CONSTRAINT "EntryScore_matchId_fkey";

-- AddForeignKey
ALTER TABLE "EntryScore" ADD CONSTRAINT "EntryScore_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
