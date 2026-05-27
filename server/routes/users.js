import express from "express";

import {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
} from "../controllers/users.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.delete("/", deleteUser);

export default router;