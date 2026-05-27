import * as userQueries from "../queries/users.js";
import {userIdSchema, passwordSchema} from "../schemas/users.js";
import { ZodError } from "zod";

export async function getAllUsers(req, res) {
    try {
        const users = await userQueries.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" }, err);
    }
}

export async function getUserById(req, res) {
    try {
        const userId = userIdSchema.parse(req.params.id);
        const user = await userQueries.getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: "Validation error",
                details: error.issues[0].message,
            });
        }

        return res.status(500).json({ error: "Failed to fetch user" });
    }
}

export async function createUser(req, res) {
    try {
        const payload = req.body || {};

        // validate payload

        // destructure payload

        if (!payload.username || !payload.email) {
            return res.status(400).json({
                error: "username and email and password are required",
            });
        }

        const newUser = await userQueries.createUser(payload.username, payload.email, payload.password_hash);

        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(500).json({ error: "Failed to create user" }, err);
    }
}

export async function deleteUserById(req, res) {
    try {

        const { userId } = req.param.id || {};

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = await userQueries.deleteUser(userId);

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user" }, err);
    }
}