-- CreateTable
CREATE TABLE "ResponseEmbedding" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "document" TEXT,
    "embedding" vector,
    "status" "EmbeddingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResponseEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResponseEmbedding_submissionId_key" ON "ResponseEmbedding"("submissionId");

-- CreateIndex
CREATE INDEX "ResponseEmbedding_formId_idx" ON "ResponseEmbedding"("formId");

-- AddForeignKey
ALTER TABLE "ResponseEmbedding" ADD CONSTRAINT "ResponseEmbedding_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseEmbedding" ADD CONSTRAINT "ResponseEmbedding_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
