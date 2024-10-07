-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "purchasedDocumentId" TEXT;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_purchasedDocumentId_fkey" FOREIGN KEY ("purchasedDocumentId") REFERENCES "PurchasedDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
