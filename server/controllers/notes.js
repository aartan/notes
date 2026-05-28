import * as noteQueries from "../queries/notes.js";
import {
  noteIdSchema,
  createNotePayloadSchema,
  updateNotePayloadSchema,
} from "../schemas/notes.js";
import { ZodError } from "zod";
import { formatZodErrors } from "../utils/validation.js";

export async function getAllNotes(req, res) {
  try {
    const notes = await noteQueries.getAllNotes();
    res.json(notes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch notes", message: error.message });
  }
}

export async function getNoteById(req, res) {
  try {
    const noteId = noteIdSchema.parse(req.params.id);
    const note = await noteQueries.getNoteById(noteId);
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json(note);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: formatZodErrors(error, "noteId"),
      });
    }

    return res
      .status(500)
      .json({ error: "Failed to fetch note", message: error.message });
  }
}

export async function createNote(req, res) {
  try {
    // TODO: UPDATE TO USE USERID FROM JWT SESSION
    const payload = createNotePayloadSchema.parse(req.body);
    const newNote = await noteQueries.createNote(payload);

    return res.status(201).json(newNote);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: formatZodErrors(error),
      });
    }

    return res
      .status(500)
      .json({ error: "Failed to create note", message: error.message });
  }
}

export async function deleteNote(req, res) {
  try {
    const noteId = noteIdSchema.parse(req.params.id);
    const note = await noteQueries.deleteNote(noteId);
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json(note);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: formatZodErrors(error, "noteId"),
      });
    }

    res
      .status(500)
      .json({ error: "Failed to delete note", message: error.message });
  }
}

export async function updateNote(req, res) {
  try {
    const noteId = noteIdSchema.parse(req.params.id);
    const updates = updateNotePayloadSchema.parse(req.body);
    const note = await noteQueries.updateNote(noteId, updates);
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json(note);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: formatZodErrors(error),
      });
    }

    res
      .status(500)
      .json({ error: "Failed to update note", message: error.message });
  }
}
