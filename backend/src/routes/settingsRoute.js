import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/api/settings", getSettings); // tidak pake verifyAdmin agar user bisa melihat kontennya
router.post("/api/settings", verifyAdmin, updateSettings);

export default router;
