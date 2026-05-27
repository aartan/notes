import * as z from "zod";

export const userIdSchema = z.uuid()
export const passwordSchema = z
    .string()
    .min(8)
    .max(30)

export const userNameSchema = z
    .string({ required_error: "Username is required" })
    .min(3, "Username must be at least 3 characters")
    .max(20)

export const emailSchema = z.email();
export const createUserPayloadSchema = z.object({
    username: userNameSchema,
    email: emailSchema,
    password: passwordSchema,
});
export const updateUserPayloadSchema = z.object({
    username: userNameSchema,
    email: emailSchema,
    password: passwordSchema,})