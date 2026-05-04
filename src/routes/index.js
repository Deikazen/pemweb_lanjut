// routes/index.js
import express from "express";
import userRoute from "./userRoute.js";
import itemRoute from "./itemRoute.js";

const router = express.Router();

// Gabungkan semua route di sini
router.use(userRoute);
router.use(itemRoute);

export default router;