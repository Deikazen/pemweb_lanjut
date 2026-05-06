import express from "express";


import { getUser, createUser, editUser, deleteUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/api/user", getUser);
router.post("/api/user", createUser);
router.delete("/api/user/:id", deleteUser);
router.put("/api/user/:id", editUser);

router.post("/api/login", loginUser)


export default router;