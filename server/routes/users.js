import express from "express";

import {
    getAllUsers,
    getUserById,
    createUser,
    deleteUserById,
} from "../controllers/users.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.delete("/", deleteUserById);

export default router;