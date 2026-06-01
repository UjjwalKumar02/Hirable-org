import { Job, Worker } from "bullmq";
import { emailDLQ } from "../queues/email.queue.js";
import { sendEmail } from "../lib/nodemailer.js";
import { redisConnection } from "../lib/redis.js";

const worker = new Worker(
  "email_queue",
  async (job: Job) => {
    const { to, emailType, payload } = job.data;

    console.log(to, emailType, payload);

    try {
      if (emailType === "verify-email") {
        const OTP = payload.OTP;

        console.log("Sending email from worker...");

        await sendEmail({
          to,
          subject: "Email verification",
          body: `To verify your email, please enter the ${OTP}`,
        });
      } else if (emailType === "credit-purchase") {
        const credits = payload.credits;

        console.log("Sending email from worker...");

        await sendEmail({
          to,
          subject: "Credits purchase",
          body: `The credits equals to ${credits} is added to your account`,
        });
      }
    } catch (error: any) {
      if (job.attemptsMade >= job.opts.attempts!) {
        await emailDLQ.add("email_dlq", {
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
