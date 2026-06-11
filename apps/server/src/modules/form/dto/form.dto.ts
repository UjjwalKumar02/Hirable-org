import { z } from "zod";

export const CreateFormDTO = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
});

export const UpdateFormDTO = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  fieldList: z.array(
    z.object({
      label: z.string().min(2),
      type: z.enum(["TEXT", "LONG_TEXT", "NUMBER", "EMAIL", "DROPDOWN"]),
      required: z.boolean(),
      wordLimit: z.number().nullable(),
      options: z.array(z.string()).default([]),
    }),
  ),
});

export const SubmitFormDTO = z.object({
  responseData: z.array(
    z.object({
      formFieldId: z.string().min(2),
      value: z.string(),
    }),
  ),
});
