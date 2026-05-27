import express from "express";

import {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
} from "../controllers/users.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.delete("/", deleteUser);
router.put("/", updateUser);

export default router;