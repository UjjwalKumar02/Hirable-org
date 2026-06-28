import { sendEmail } from "../lib/nodemailer.js";
import { dequeue } from "../queues/dequeue.js";
import { moveToDead } from "../queues/moveToDead.js";
import { addToProcessing, removeFromProcessing } from "../queues/processing.js";
import { retry } from "../queues/retry.js";
import {
  resetSleepDelay,
  sleepWithBackoff,
} from "../utils/sleepWithExponentialDelay.js";

async function emailWorker() {
  while (true) {
    try {
      const job = await dequeue({ queue: "email" });
      if (!job) {
        await sleepWithBackoff();
        continue;
      }

      resetSleepDelay();

      await addToProcessing({ queue: "email", job });

      const type = job.type;
      const payload = job.payload;
      console.log(
        `Email worker processing: ${job.id}-${type}-${JSON.stringify(payload)}`,
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

        await removeFromProcessing({ queue: "email", job });
      } catch (error) {
        console.log(`Handler failed, adding job to retry: ${job}`);

        await removeFromProcessing({ queue: "email", job });

        if (job.attempts >= job.maxAttempts) {
          // move to dead
          await moveToDead({
            queue: "email",
            job,
            error: JSON.stringify(error),
          });

          console.log(`Max attempts reached, adding job to dead: ${job}`);
        } else {
          // retry
          job.attempts++;
          await retry({ queue: "email", job });
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
    await emailWorker();
    console.log("Email worker is running...");
  } catch (error) {
    console.log("Email worker startup error: ", error);
  }
})();
