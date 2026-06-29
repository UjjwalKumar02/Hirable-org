import { prisma } from "@repo/database/client";
import { sendEmail } from "../lib/nodemailer.js";
import { dequeue } from "../queues/dequeue.js";
import { sleep } from "../utils/sleep.js";
import { generateEmbedding } from "../lib/gemini.js";
import { sleepWithBackoff } from "../utils/sleepWithExponentialDelay.js";

export async function prodWorker() {
  while (true) {
    try {
      let emailJob = await dequeue({ queue: "email" });
      if (emailJob) {
        const type = emailJob.type;
        const payload = emailJob.payload;
        console.log(
          `Worker processing: ${emailJob.id}-${type}-${JSON.stringify(payload)}`,
        );

        if (!payload || payload === undefined || payload === null) {
          throw new Error(`Invalid payload: ${JSON.stringify(payload)}`);
        }

        try {
          switch (type) {
            case "verify-email":
              await sendEmail({
                to: payload.to,
                subject: "Verify Email",
                body: `OTP: ${payload.OTP}`,
              });
              break;

            case "credit-purchase":
              await sendEmail({
                to: payload.to,
                subject: "Credits purchased",
                body: `Purchased Credits : ${payload.credits}`,
              });
              break;

            default:
              console.warn("Unknown job:", type);
          }
        } catch (error) {
          console.log(`Handler failed for job: ${JSON.stringify(emailJob)}`);
        }
      }

      // Cooling period for next task
      await sleep(4000);

      let embeddingJob = await dequeue({ queue: "embedding" });
      if (embeddingJob) {
        const type = embeddingJob.type;
        const payload = embeddingJob.payload;
        console.log(
          `Worker processing: ${embeddingJob.id}-${type}-${JSON.stringify(payload)}`,
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
        } catch (error) {
          console.log(
            `Handler failed for job: ${JSON.stringify(embeddingJob)}`,
          );
        }
      }
    } catch (error) {
      console.log(`Redis connection error: ${error}`);
      await sleep(120000);
    }

    // Cooling period before next iteration
    await sleepWithBackoff();
  }
}
