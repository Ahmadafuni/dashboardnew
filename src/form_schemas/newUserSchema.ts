import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Please enter a username.",
    })
    .max(50),
  password: z
    .string()
    .min(6, {
      message: "Please enter atleast 6 letter for a password.",
    })
    .max(50),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(1, {
      message: "Please enter an email address.",
    })
    .max(50),
  firstname: z
    .string()
    .min(1, {
      message: "Please enter first name.",
    })
    .max(50),
  lastname: z
    .string()
    .min(1, {
      message: "Please enter last name.",
    })
    .max(50),
  role: z
    .string()
    .min(1, {
      message: "Please enter user role.",
    })
    .max(50),
  category: z
    .string()
    .min(1, {
      message: "Please enter user category.",
    })
    .max(50),
  phoneNumber: z
    .string()
    .min(10, {
      message: "Please enter valid phone number.",
    })
    .max(50),
});

export const userUpdateSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Please enter a username.",
    })
    .max(50),
  password: z.string().max(50),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(1, {
      message: "Please enter an email address.",
    })
    .max(50),
  firstname: z
    .string()
    .min(1, {
      message: "Please enter first name.",
    })
    .max(50),
  lastname: z
    .string()
    .min(1, {
      message: "Please enter last name.",
    })
    .max(50),
  role: z
    .string()
    .min(1, {
      message: "Please enter user role.",
    })
    .max(50),
  category: z
    .string()
    .min(1, {
      message: "Please enter user category.",
    })
    .max(50),
  phoneNumber: z
    .string()
    .min(10, {
      message: "Please enter valid phone number.",
    })
    .max(50),
});
