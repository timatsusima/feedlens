-- CreateIndex
CREATE INDEX "snapshots_created_at_idx" ON "snapshots"("created_at");

-- CreateIndex
CREATE INDEX "snapshots_deleted_at_idx" ON "snapshots"("deleted_at");

-- CreateIndex
CREATE INDEX "snapshots_city_idx" ON "snapshots"("city");

-- CreateIndex
CREATE INDEX "snapshots_age_bucket_idx" ON "snapshots"("age_bucket");

-- CreateIndex
CREATE INDEX "snapshots_city_age_bucket_idx" ON "snapshots"("city", "age_bucket");

-- CreateIndex
CREATE INDEX "videos_snapshot_id_idx" ON "videos"("snapshot_id");

-- CreateIndex
CREATE INDEX "videos_video_id_idx" ON "videos"("video_id");
