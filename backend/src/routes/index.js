// routes/index.js
import express from "express";
import userRoute from "./userRoute.js";
import itemRoute from "./itemRoute.js";
import settingsRoute from "./settingsRoute.js";

const router = express.Router();


router.use(userRoute);
router.use(itemRoute);
router.use(settingsRoute);

export default router;