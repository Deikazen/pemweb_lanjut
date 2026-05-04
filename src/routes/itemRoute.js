import express from "express";


import { getItem, createItem, editItem, deleteItem } from "../controllers/ItemController.js";

const router = express.Router();

router.get("/api/Item", getItem);
router.post("/api/Item", createItem);
router.delete("/api/Item/:id", deleteItem);
router.put("/api/Item/:id", editItem);


export default router;