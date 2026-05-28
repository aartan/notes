import * as z from "zod";

export const noteIdSchema = z.uuid();

export const createNotePayloadSchema = z.object({
  title: z.string().min(1),
  note: z.string(),
  author_id: z.string().min(1), // TODO: REMOVE ONCE ID IS TIED TO SESSION
});

export const updateNotePayloadSchema = z.object({
  title: z.string().min(1).optional(),
  note: z.string().optional(),
});
