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

export const userNameSchema = z
    .string({ required_error: "Username is required" })
    .min(3, "Username must be at least 3 characters")
    .max(24, "Username must be at most 24 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
    .trim()

export const emailSchema = z.email();
export const createUserPayloadSchema = z.object({
    username: userNameSchema,
    email: emailSchema,
    password: passwordSchema,
});
export const updateUserPayloadSchema = z.object({
    id: userIdSchema,
    username: userNameSchema,
    email: emailSchema,
    password: passwordSchema,})