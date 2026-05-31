import express from "express";


import { getUser, createUser, editUser, deleteUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUser);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.put("/:id", editUser);

router.post("/login", loginUser)



export default router;
