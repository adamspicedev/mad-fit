import { z } from "zod";

export const SignUpSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export const WeightSchema = z.object({
  weight: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const WeightRowSchema = z.object({
  id: z.string(),
  userId: z.string(),
  weight: z.string(),
  date: z.date(),
});

export const TestResultSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pressUps: z.string().optional(),
  parkLap: z.string().optional(),
  stepUp: z.string().optional(),
  sledPush: z.string().optional(),
  chestPress: z.string().optional(),
  plank: z.string().optional(),
});

export const TestResultRowSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.date(),
  pressUps: z.string(),
  parkLap: z.string(),
  stepUp: z.string(),
  sledPush: z.string(),
  chestPress: z.string(),
  plank: z.string(),
});
