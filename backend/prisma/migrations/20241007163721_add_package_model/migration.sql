-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "precoDesconto" DOUBLE PRECISION,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "documentIds" TEXT[],

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);
