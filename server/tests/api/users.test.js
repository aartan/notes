import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { faker } from "@faker-js/faker";

import * as userQueries from "../../queries/users.js";

vi.mock("../../queries/users.js");

describe("Users API", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /users", () => {

        it("should return all users", async () => {

            userQueries.getAllUsers.mockResolvedValue([
                { id: 1, username: "john" },
                { id: 2, username: "jane" },
            ]);

            const res = await request(app).get("/users");

            expect(res.status).toBe(200);

            expect(res.body).toEqual([
                { id: 1, username: "john" },
                { id: 2, username: "jane" },
            ]);
        });

        it("should return empty array when no users exist", async () => {
            userQueries.getAllUsers.mockResolvedValue([]);

            const res = await request(app).get("/users");

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it("should return 500 on database error", async () => {
            userQueries.getAllUsers.mockRejectedValue(new Error("DB error"));

            const res = await request(app).get("/users");

            expect(res.status).toBe(500);
        });
    });

    describe("GET /users/:id", () => {

        it("should return a user", async () => {

            const mockUserId = faker.string.uuid();

            userQueries.getUserById.mockResolvedValue({
                id: mockUserId,
                username: "john",
            });

            const res = await request(app).get(`/users/${mockUserId}`);

            expect(res.status).toBe(200);

            expect(res.body).toEqual({
                id: mockUserId,
                username: "john",
            });
        });

        it("should return validation error for invalid ID", async () => {

            const res = await request(app).get("/users/abc");
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });

        it("should return 404 when user is not found", async () => {
            userQueries.getUserById.mockResolvedValue(null);

            const res = await request(app).get(`/users/${faker.string.uuid()}`);

            expect(res.status).toBe(404);
            expect(res.body.error).toBe("User not found");
        });
    });

    describe("POST /users", () => {

        it("should create a user", async () => {

            const mockUser = {
                id: faker.string.uuid(),
                username: faker.internet.username(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 20 }),
            };

            userQueries.createUser.mockResolvedValue({
                id: mockUser.id,
                username: mockUser.username,
                email: mockUser.email,
            });

            const payload = {
                username: mockUser.password,
                email: mockUser.email,
                password: mockUser.password,
            };

            const res = await request(app)
                .post("/users")
                .send(payload);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                id: mockUser.id,
                username: mockUser.username,
                email: mockUser.email,
            });
        });

        it("should fail validation", async () => {

            const res = await request(app)
                .post("/users")
                .send({
                    username: "",
                });

            expect(res.status).toBe(400);

            expect(res.body.error).toBe("Validation error");
        });
    });

    describe("DELETE /users/:id", () => {

        it("should delete a user", async () => {

            userQueries.deleteUser.mockResolvedValue({
                deleted: true,
            });

            const res = await request(app)
                .delete(`/users/${faker.string.uuid()}`);

            expect(res.status).toBe(200);

            expect(res.body).toEqual({
                deleted: true,
            });
        });

        it("should return 400 for invalid ID format", async () => {
            const res = await request(app).delete("/users/abc");

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });

        it("should return 404 when user to delete is not found", async () => {
            userQueries.deleteUser.mockResolvedValue(null);

            const res = await request(app).delete(`/users/${faker.string.uuid()}`);

            expect(res.status).toBe(404);
            expect(res.body.error).toBe("User not found");
        });
    });

    describe("PUT /users/:id", () => {

        it("should update a user", async () => {

            const mockUser = {id: faker.string.uuid(),
                username: faker.internet.username(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 20 }),
            };

            userQueries.updateUser.mockResolvedValue({
                id: mockUser.id,
                username: mockUser.username,
            });

            const res = await request(app)
                .put(`/users/${mockUser.id}`)
                .send({
                    email: mockUser.email,
                    username: mockUser.username,
                    password: mockUser.password,
                });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                id: mockUser.id,
                username: mockUser.username,
            });
        });

        it("should return 400 for invalid ID format", async () => {
            const res = await request(app)
                .put("/users/abc")
                .send({
                    username: faker.internet.username(),
                    email: faker.internet.email(),
                    password: faker.internet.password({ length: 20 }),
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });

        it("should return 404 when user to update is not found", async () => {
            userQueries.updateUser.mockResolvedValue(null);

            const res = await request(app)
                .put(`/users/${faker.string.uuid()}`)
                .send({
                    username: faker.internet.username(),
                    email: faker.internet.email(),
                    password: faker.internet.password({ length: 20 }),
                });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe("User not found");
        });

        it("should return 400 on invalid payload", async () => {
            const res = await request(app)
                .put(`/users/${faker.string.uuid()}`)
                .send({ email: "not-an-email" });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });
    });
});