import express from "express";


import { getItem, createItem, editItem, deleteItem } from "../controllers/itemController.js";

const router = express.Router();

router.get("/api/item", getItem);
router.post("/api/item", createItem);
router.delete("/api/item/:id", deleteItem);
router.put("/api/item/:id", editItem);


export default router;