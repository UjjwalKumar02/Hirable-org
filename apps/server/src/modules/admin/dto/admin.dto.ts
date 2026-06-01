import { z } from "zod";

export const CreateCreditPackageDTO = z.object({
  name: z.string().min(3),
  credits: z.number().min(0),
  priceInPaise: z.number().min(0),
  isActive: z.boolean(),
});
