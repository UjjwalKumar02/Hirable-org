import { Job, Worker } from "bullmq";
import { redisConnection } from "../lib/redis.js";
import { embeddingDLQ } from "../queues/embedding.queue.js";
import { prisma } from "@repo/database/client";
import { generateEmbedding } from "../lib/gemini.js";

const worker = new Worker(
  "embedding_queue",
  async (job: Job) => {
    const { responseEmbeddingId, document } = job.data;

    console.log("Worker processing :", { responseEmbeddingId, document });

    try {
      const responseEmbedding = await prisma.responseEmbedding.findUnique({
        where: { id: responseEmbeddingId },
      });
      if (!responseEmbedding) {
        throw new Error("Response embedding not found in DB!");
      }

      let embeddings = await generateEmbedding(document);

      const vector = `[${embeddings.join(",")}]`;

      await prisma.$executeRaw`
        UPDATE "ResponseEmbedding"
        SET
          embedding = ${vector}::vector,
          status = 'COMPLETED'
        WHERE id = ${responseEmbeddingId}
      `;

      console.log("Embedding genearation and updation in DB success");
    } catch (error: any) {
      if (job.attemptsMade >= job.opts.attempts!) {
        await embeddingDLQ.add("embedding_dlq", {
          ...job.data,
          error: error.message,
          attemptsMade: job.attemptsMade,
          failedAt: new Date(),
        });

        // remove from main queue
        await job.remove();
      }

      throw error;
    }
  },
  { connection: redisConnection },
);

(async () => {
  try {
    worker.on("failed", (job, err) => {
      console.log(err);
    });
  } catch (error: any) {
    console.log(error.message);
  }
})();
