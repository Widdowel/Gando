-- AddForeignKey
ALTER TABLE "Attribution" ADD CONSTRAINT "Attribution_cotisationId_fkey" FOREIGN KEY ("cotisationId") REFERENCES "Cotisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
