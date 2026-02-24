-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "slug" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "user_id" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" BIGINT NOT NULL,
    "link_id" TEXT NOT NULL,
    "referrer" TEXT,
    "country" TEXT,
    "device" TEXT NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_slug_key" ON "Link"("slug");

-- CreateIndex
CREATE INDEX "Link_slug_user_id_created_at_idx" ON "Link"("slug", "user_id", "created_at");

-- CreateIndex
CREATE INDEX "Visit_link_id_idx" ON "Visit"("link_id");

-- CreateIndex
CREATE INDEX "Visit_link_id_created_at_idx" ON "Visit"("link_id", "created_at");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
