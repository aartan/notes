import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../app.js";
import { faker } from "@faker-js/faker";

import * as userQueries from "../../../queries/users.js";

vi.mock("../../../queries/users.js");

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
    });
});