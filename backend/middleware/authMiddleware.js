import { createStatelessClient } from "../config/supabaseClient.js";

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Cek apakah header authorization ada dan menggunakan format Bearer
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
        }

        // 2. Ekstrak token dari header
        const token = authHeader.split(' ')[1];

        // 3. Verifikasi token menggunakan Supabase auth
        const statelessClient = createStatelessClient();
        const { data: { user }, error: authError } = await statelessClient.auth.getUser(token);

        // 4. Tangani jika token tidak valid / kadaluarsa
        if (authError || !user) {
            console.error("verifyToken Auth Error:", authError?.message);
            return res.status(401).json({ message: "Token tidak valid atau sudah kadaluarsa." });
        }

        // 5. Simpan data user ke dalam object request (req)
        // Ini yang membuat req.user.id di cartController kamu bisa berfungsi
        req.user = user;

        // Lanjut ke middleware berikutnya atau controller
        next();

    } catch (error) {
        return res.status(500).json({ message: "Terjadi kesalahan server!", error: error.message });
    }
}