import { z } from "zod";

export const SignupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine(
    (data) => data.password.toString() === data.confirmPassword.toString(),
    {
      message: "Passwords must match",
      path: ["confirmPassword"],
    }
  );

export const SigninSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
