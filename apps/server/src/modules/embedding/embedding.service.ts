import { embeddingQueue } from "../../queues/embedding.queue.js";

export const enqueueEmbedding = async (data: {
  responseEmbeddingId: string;
  document: string;
}) => {
  console.log("Adding job to embedding queue", data);

  await embeddingQueue.add("embedding_queue", data, {
    delay: 2000,
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  });
};
