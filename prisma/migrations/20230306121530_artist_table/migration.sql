-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "exhibitions" TEXT,
    "samples" TEXT,
    "twitter_url" TEXT NOT NULL,
    "instagram_url" TEXT,
    "website" TEXT,
    "project" TEXT NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);
