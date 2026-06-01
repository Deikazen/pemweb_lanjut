// routes/index.js
import express from "express";
import userRoutes from "./userRoute.js";
import itemRoute from "./itemRoute.js";
import settingsRoute from "./settingsRoute.js";
import cartRoute from "./cartRoute.js";

const router = express.Router();


router.use('/api/user', userRoutes);
router.use(itemRoute);
router.use(settingsRoute);
router.use('/api/cart', cartRoute);

export default router;