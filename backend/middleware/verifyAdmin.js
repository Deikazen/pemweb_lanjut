import { supabase, createStatelessClient } from "../config/supabaseClient.js";

export const verifyAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan" });
        }

        const token = authHeader.split(' ')[1];
        const statelessClient = createStatelessClient();
        const { data: { user }, error: authError } = await statelessClient.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ message: "Token tidak valid atau sudah kadaluarsa." });
        }
        const { data: userData, error: dbError } = await supabase
            .from('users')
            .select('role')
            .eq('email', user.email)
            .single();

        if (dbError || !userData || userData.role !== 'admin') {
            console.error("verifyAdmin Access Denied:", {
                dbError: dbError || null,
                userData: userData || null,
                authenticatedEmail: user.email
            });
            return res.status(403).json({ 
                message: "Akses dilarang. Hanya admin yang dizinkan!",
                debug: {
                    authenticatedEmail: user.email,
                    foundInDatabase: !!userData,
                    dbRole: userData ? userData.role : null,
                    dbError: dbError ? dbError.message : null
                }
            });
        }

        req.user = user;
        next();


    } catch (error) {
        return res.status(500).json({ messgae: "Terjadi kesalahan server!", error: error.message });
    }
}