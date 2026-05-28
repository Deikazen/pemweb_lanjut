import express from "express";


import { getUser, createUser, editUser, deleteUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

// router.get("/api/user", getUser);
// router.post("/api/user", createUser);
// router.delete("/api/user/:id", deleteUser);
// router.put("/api/user/:id", editUser);

router.post("/api/login", loginUser)

// ⚠️ TEMPORARY: Debug endpoint — hapus setelah masalah selesai!
router.get("/api/debug-env", (req, res) => {
    const mask = (val) => {
        if (!val) return "❌ TIDAK ADA";
        if (val.length <= 10) return val.substring(0, 3) + "***";
        return val.substring(0, 10) + "..." + val.substring(val.length - 5) + ` (${val.length} chars)`;
    };
    res.json({
        SUPABASE_URL: process.env.SUPABASE_URL || "❌ TIDAK ADA",
        SUPABASE_ROLE_KEY: mask(process.env.SUPABASE_ROLE_KEY),
        SUPABASE_ROLE_KEY_starts_with_eyJ: process.env.SUPABASE_ROLE_KEY ? process.env.SUPABASE_ROLE_KEY.trim().startsWith("eyJ") : false,
        SUPABASE_KEY: mask(process.env.SUPABASE_KEY),
        SUPABASE_KEY_starts_with_eyJ: process.env.SUPABASE_KEY ? process.env.SUPABASE_KEY.trim().startsWith("eyJ") : false,
        RESOLVED_KEY_SOURCE: process.env.SUPABASE_ROLE_KEY ? "SUPABASE_ROLE_KEY" : (process.env.SUPABASE_KEY ? "SUPABASE_KEY" : "❌ NONE"),
        FRONTEND_URL: process.env.FRONTEND_URL || "❌ TIDAK ADA",
        NODE_ENV: process.env.NODE_ENV || "not set",
    });
});


export default router;