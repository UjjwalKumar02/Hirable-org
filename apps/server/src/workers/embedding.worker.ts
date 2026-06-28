import { prisma } from "@repo/database/client";
import { dequeue } from "../queues/dequeue.js";
import { generateEmbedding } from "../lib/gemini.js";
import { addToProcessing, removeFromProcessing } from "../queues/processing.js";
import { moveToDead } from "../queues/moveToDead.js";
import { retry } from "../queues/retry.js";
import {
  resetSleepDelay,
  sleepWithBackoff,
} from "../utils/sleepWithExponentialDelay.js";

async function embeddingWorker() {
  while (true) {
    try {
      const job = await dequeue({ queue: "embedding" });
      if (!job) {
        await sleepWithBackoff();
        continue;
      }

      resetSleepDelay();

      await addToProcessing({ queue: "embedding", job });

      const type = job.type;
      const payload = job.payload;
      console.log(
        `Embedding worker processing: ${job.id}-${type}-${JSON.stringify(payload)}`,
      );

      if (!payload || payload === undefined || payload === null) {
        throw new Error(`Invalid payload: ${JSON.stringify(payload)}`);
      }

      try {
        const responseEmbedding = await prisma.responseEmbedding.findUnique({
          where: { id: payload.responseEmbeddingId },
        });
        if (!responseEmbedding) {
          throw new Error("Response embedding not found in DB!");
        }

        let embeddings = await generateEmbedding(payload.document);

        const vector = `[${embeddings.join(",")}]`;

        await prisma.$executeRaw`
              UPDATE "ResponseEmbedding"
              SET
                embedding = ${vector}::vector,
                status = 'COMPLETED'
              WHERE id = ${payload.responseEmbeddingId}
            `;

        console.log("Embedding genearation and updation in DB success");

        await removeFromProcessing({ queue: "embedding", job });
      } catch (error) {
        console.log(`Handler failed, adding job to retry: ${job}`);

        await removeFromProcessing({ queue: "embedding", job });

        if (job.attempts >= job.maxAttempts) {
          // move to dead
          await moveToDead({
            queue: "embedding",
            job,
            error: JSON.stringify(error),
          });

          console.log(`Max attempts reached, adding job to dead: ${job}`);
        } else {
          // retry
          job.attempts++;
          await retry({ queue: "embedding", job });
        }
      }
    } catch (error) {
      console.log("Worker failed: ", error);
      await sleepWithBackoff();
    }
  }
}

(async () => {
  try {
    await embeddingWorker();
    console.log("Embedding worker is running...");
  } catch (error) {
    console.log("Worker startup error: ", error);
  }
})();
