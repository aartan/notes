import * as userQueries from "../queries/users.js";
import {userIdSchema, createUserPayloadSchema, updateUserPayloadSchema} from "../schemas/users.js";
import { ZodError } from "zod";
import {formatZodErrors} from "../utils/validation.js";

export async function getAllUsers(req, res) {
    try {
        const users = await userQueries.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users", message: error.message  });
    }
}

export async function getUserById(req, res) {
    try {
        const userId = userIdSchema.parse(req.params.id);
        const user = await userQueries.getUserById(userId);

        res.json(user);
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: "Validation error",
                details: formatZodErrors(error, "userId"),
            });
        }

        return res.status(500).json({ error: "Failed to fetch user", message: error.message  });
    }
}

export async function createUser(req, res) {
    try {
        const { username, email, password } = createUserPayloadSchema.parse(req.body);
        const newUser = await userQueries.createUser(username, email, password);

        return res.status(201).json(newUser);
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: "Validation error",
                details: formatZodErrors(error),
            });
        }

        return res.status(500).json({ error: "Failed to create user", message: error.message  });
    }
}

export async function deleteUser(req, res) {
    try {
        const userId = userIdSchema.parse(req.params.id);
        const user = await userQueries.deleteUser(userId);

        res.json(user);
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: "Validation error",
                details: formatZodErrors(error, "userId"),
            });
        }
        res.status(500).json({ error: "Failed to delete user", message: error.message  });
    }
}

export async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        const userObject = updateUserPayloadSchema.parse({...req.body, userId});
        const user = await userQueries.updateUser({userId, userObject});

        res.json(user);
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: "Validation error",
                details: formatZodErrors(error),
            });
        }
        res.status(500).json({ error: "Failed to update user", message: error.message });
    }
}