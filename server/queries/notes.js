import db from "../database/db.js";

export async function getAllNotes() {
  return await db("notes").select("*");
}

export async function getNoteById(id) {
  return db("notes")
    .where({ id })
    .first();
}

export async function createNote({ title, note, is_deleted }) {
  const [newNote] = await db("notes")
    .insert({ title, note, is_deleted })
    .returning("*");

  return newNote;
}

export async function updateNote(id, updates) {
  const [updatedNote] = await db("notes")
    .where({ id })
    .update(updates)
    .returning("*");

  return updatedNote;
}

export async function deleteNote(id) {
  return db("notes")
    .where({ id })
    .del();
}