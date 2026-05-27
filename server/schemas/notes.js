import * as z from "zod";

export const noteIdSchema = z.uuid();

export const createNotePayloadSchema = z.object({
  title: z.string().min(1),
  note: z.string(),
  is_deleted: z.boolean().default(false),
});

export const updateNotePayloadSchema = z.object({
  title: z.string().min(1).optional(),
  note: z.string().optional(),
  is_deleted: z.boolean().optional(),
});