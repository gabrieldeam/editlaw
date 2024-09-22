-- CreateTable
CREATE TABLE "Law" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Law_pkey" PRIMARY KEY ("id")
);
