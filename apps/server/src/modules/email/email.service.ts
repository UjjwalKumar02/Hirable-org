import { emailQueue } from "../../queues/email.queue.js";

export const enqueueEmail = async (data: {
  to: string;
  emailType: "verify-email" | "credit-purchase" | "form-limit" | "rate-limit";
  payload: any;
}) => {
  console.log("Adding job in queue", data);

  await emailQueue.add("send_email", data, {
    delay: 2000,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  });
};
