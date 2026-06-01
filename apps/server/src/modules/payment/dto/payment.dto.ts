import { z } from "zod";

export const CreateOrderDTO = z.object({
  creditPackageId: z.string().min(3),
});

export const VerifyPaymentDTO = z.object({
  razorpay_order_id: z.string().min(3),
  razorpay_payment_id: z.string().min(3),
  razorpay_signature: z.string().min(3),
  orderedCredits: z.number().min(2),
});
