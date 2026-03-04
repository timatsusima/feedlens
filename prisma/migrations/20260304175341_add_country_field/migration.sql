-- AlterTable
ALTER TABLE "snapshots" ADD COLUMN     "country" TEXT;

-- CreateIndex
CREATE INDEX "snapshots_country_idx" ON "snapshots"("country");
