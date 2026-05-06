import express from "express";


import { getItem, createItem, editItem, deleteItem } from "../controllers/itemController.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/api/item", verifyAdmin, getItem);
router.post("/api/item", verifyAdmin, createItem);
router.delete("/api/item/:id", verifyAdmin, deleteItem);
router.put("/api/item/:id", verifyAdmin, editItem);


export default router;