import * as z from "zod";

export const userIdSchema = z.uuid()
export const passwordSchema = z
    .string()
    .min(8)
    .max(24)
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^a-zA-Z0-9]/, "Must contain a special character");

