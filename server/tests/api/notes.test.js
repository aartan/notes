import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { faker } from "@faker-js/faker";

import * as noteQueries from "../../queries/notes.js";

vi.mock("../../queries/notes.js");

describe("Notes API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /notes", () => {
    it("should return all notes", async () => {
      noteQueries.getAllNotes.mockResolvedValue([
        {
          id: faker.string.uuid(),
          title: "Note 1",
          note: "Body 1",
          is_deleted: false,
        },
        {
          id: faker.string.uuid(),
          title: "Note 2",
          note: "Body 2",
          is_deleted: false,
        },
      ]);

      const res = await request(app).get("/notes");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it("should return empty array when no notes exist", async () => {
      noteQueries.getAllNotes.mockResolvedValue([]);

      const res = await request(app).get("/notes");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return 500 on database error", async () => {
      noteQueries.getAllNotes.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/notes");

      expect(res.status).toBe(500);
    });
  });

  describe("GET /notes/:id", () => {
    it("should return a note", async () => {
      const mockNoteId = faker.string.uuid();

      noteQueries.getNoteById.mockResolvedValue({
        id: mockNoteId,
        title: "Test Note",
        note: "Test body",
        is_deleted: false,
      });

      const res = await request(app).get(`/notes/${mockNoteId}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: mockNoteId,
        title: "Test Note",
        note: "Test body",
        is_deleted: false,
      });
    });

    it("should return 400 for invalid ID format", async () => {
      const res = await request(app).get("/notes/abc");

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation error");
    });

    it("should return 404 when note is not found", async () => {
      noteQueries.getNoteById.mockResolvedValue(null);

      const res = await request(app).get(`/notes/${faker.string.uuid()}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Note not found");
    });
  });

  describe("POST /notes", () => {
    it("should create a note", async () => {
      const mockNote = {
        id: faker.string.uuid(),
        title: faker.lorem.sentence(),
        note: faker.lorem.paragraph(),
        author_id: faker.string.uuid(),
        is_deleted: false,
      };

      noteQueries.createNote.mockResolvedValue(mockNote);

      const res = await request(app).post("/notes").send({
        title: mockNote.title,
        note: mockNote.note,
        author_id: mockNote.author_id,
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockNote);
    });

    it("should fail validation when title is missing", async () => {
      const res = await request(app).post("/notes").send({ note: "Some body" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation error");
    });

    it("should fail validation when title is empty", async () => {
      const res = await request(app)
        .post("/notes")
        .send({ title: "", note: "Some body", author_id: faker.string.uuid() });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation error");
    });

    it("should return 500 on database error", async () => {
      noteQueries.createNote.mockRejectedValue(new Error("DB error"));

      const res = await request(app)
        .post("/notes")
        .send({ title: "Title", note: "Body", author_id: faker.string.uuid() });

      expect(res.status).toBe(500);
    });
  });

  describe("DELETE /notes/:id", () => {
    it("should delete a note", async () => {
      noteQueries.deleteNote.mockResolvedValue({ deleted: true });

      const res = await request(app).delete(`/notes/${faker.string.uuid()}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ deleted: true });
    });

    it("should return 400 for invalid ID format", async () => {
      const res = await request(app).delete("/notes/abc");

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation error");
    });

    it("should return 404 when note to delete is not found", async () => {
      noteQueries.deleteNote.mockResolvedValue(null);

      const res = await request(app).delete(`/notes/${faker.string.uuid()}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Note not found");
    });
  });

  describe("PUT /notes/:id", () => {
    it("should update a note", async () => {
      const mockNote = {
        id: faker.string.uuid(),
        title: faker.lorem.sentence(),
        note: faker.lorem.paragraph(),
        is_deleted: false,
      };

      noteQueries.updateNote.mockResolvedValue(mockNote);

      const res = await request(app)
        .put(`/notes/${mockNote.id}`)
        .send({ title: mockNote.title, note: mockNote.note });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockNote);
    });

    it("should return 400 for invalid ID format", async () => {
      const res = await request(app)
        .put("/notes/abc")
        .send({ title: "Updated title" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation error");
    });

    it("should return 404 when note to update is not found", async () => {
      noteQueries.updateNote.mockResolvedValue(null);

      const res = await request(app)
        .put(`/notes/${faker.string.uuid()}`)
        .send({ title: "Updated title" });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Note not found");
    });

    it("should return 400 on invalid payload", async () => {
      const res = await request(app)
        .put(`/notes/${faker.string.uuid()}`)
        .send({ title: "", is_deleted: "not-a-boolean" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation error");
    });
  });
});
