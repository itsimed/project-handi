-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CV', 'COVER_LETTER');

-- CreateTable
CREATE TABLE "application_documents" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "storageType" TEXT NOT NULL DEFAULT 'local',
    "storagePath" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "application_documents_applicationId_idx" ON "application_documents"("applicationId");

-- AddForeignKey
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
