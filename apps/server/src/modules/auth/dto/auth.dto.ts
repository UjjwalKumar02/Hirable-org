import z from "zod";

export const SignupDTO = z.object({
  username: z.string().min(1).max(100),
  email: z.email().min(2).max(100),
  password: z.string().min(2).max(100),
});

export const verifyEmailDTO = z.object({
  otp: z.string().min(6).max(6),
  userId: z.string().min(2),
});

export const LoginDTO = z.object({
  email: z.email().min(2).max(100),
  password: z.string().min(2).max(100),
});
