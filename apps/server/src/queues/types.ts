export type Queue = "email" | "embedding";

export type QueueJobType =
  | "verify-email"
  | "credit-purchase"
  | "generate-embedding";

export interface QueueJob {
  id: string;
  type: QueueJobType;
  payload: any;
  createdAt: number;
  attempts: number;
  maxAttempts: number;
}
