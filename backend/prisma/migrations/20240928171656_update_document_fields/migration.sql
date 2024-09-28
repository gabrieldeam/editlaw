/*
  Warnings:

  - You are about to drop the `Cadastro` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `autor` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preco` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cadastro" DROP CONSTRAINT "Cadastro_documentId_fkey";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "autor" TEXT NOT NULL,
ADD COLUMN     "descricao" TEXT NOT NULL,
ADD COLUMN     "preco" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "precoDesconto" DOUBLE PRECISION;

-- DropTable
DROP TABLE "Cadastro";
