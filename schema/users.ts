import { isEmailExists, isUserExists } from "@/server/functions/auth";

import { z } from "zod";

export const createUserSchema = z
  .object({
    email: z
      .string({ required_error: "Please enter an email" })
      .email({ message: "Invalid email" }),
    password: z
      .string({ required_error: "Please enter a password" })
      .min(5, { message: "Password must contains at least 5 characters" }),
    confirmPassword: z.string({
      required_error: "Please confirm your password",
    }),
  })
  .refine(async ({ email }) => await isEmailExists({ email }), {
    message: "Email is taken, try another one",
    path: ["email"],
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }

    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      checkPassComplexity.addIssue({
        path: ["password"],
        code: "custom",
        message: "password does not meet complexity requirements",
      });
    }
  });

export const loginUserSchema = z
  .object({
    email: z
      .string({ required_error: "Please enter an email" })
      .email({ message: "Invalid email" }),
    password: z.string({ required_error: "Please enter a password" }),
  })
  .refine(async (user) => await isUserExists(user), {
    message: "Invalid username or password",
    path: ["email"],
  });

export type CreateUser = z.infer<typeof createUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
