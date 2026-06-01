import { supabase, createStatelessClient } from "../../config/supabaseClient.js";


const getUser = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized. Please configure SUPABASE_URL and SUPABASE_KEY in Vercel Environment Variables!" });
    }
    const { data, error } = await supabase.from('users').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Berhasil mengambil data user", data });
}

const createUser = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized. Please configure SUPABASE_URL and SUPABASE_KEY in Vercel Environment Variables!" });
    }
    const { name, email } = req.body;
    const { data, error } = await supabase.from('users').insert([{ name, email, role: 'customer' }]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: "Berhasil membuat user", data });
}

const editUser = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized. Please configure SUPABASE_URL and SUPABASE_KEY in Vercel Environment Variables!" });
    }
    const { id } = req.params;
    const { name, email } = req.body;
    const { data, error } = await supabase.from('users').update({ name, email }).eq('id', id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Berhasil mengedit user", data });
}

const deleteUser = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized. Please configure SUPABASE_URL and SUPABASE_KEY in Vercel Environment Variables!" });
    }
    const { id } = req.params;
    const { error } = await supabase.from('users').delete().eq("id", id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Berhasil delete User" });

}

const registerUser = async (req, res) => {
    try {
        if (!supabase) {
            return res.status(500).json({ error: "Supabase client is not initialized." });
        }

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Nama, email, dan password wajib diisi." });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password minimal 6 karakter." });
        }

        // 1. Register di Supabase Auth
        const statelessClient = createStatelessClient();
        const { data: authData, error: authError } = await statelessClient.auth.signUp({
            email: email,
            password: password,
        });

        if (authError) {
            console.error("registerUser Supabase auth error:", authError);
            return res.status(400).json({ error: authError.message });
        }

        // 2. Insert ke tabel users dengan role 'customer'
        const { data: userData, error: dbError } = await supabase
            .from('users')
            .insert([{ name, email, role: 'customer' }])
            .select();

        if (dbError) {
            console.error("registerUser DB insert error:", dbError);
            // Auth sudah terdaftar tapi gagal insert ke tabel users
            return res.status(400).json({ 
                error: dbError.message,
                hint: "Akun auth berhasil dibuat tapi gagal menyimpan data user ke database."
            });
        }

        res.status(201).json({
            message: "Registrasi berhasil! Silakan login.",
            data: userData
        });
    } catch (err) {
        console.error("registerUser critical error:", err);
        res.status(500).json({
            error: err.message || "Terjadi kesalahan internal pada proses registrasi."
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const statelessClient = createStatelessClient();
        const { data, error } = await statelessClient.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            console.error("loginUser Supabase auth error:", error);
            const isInvalidKey = error.message && error.message.toLowerCase().includes("api key");
            return res.status(401).json({
                error: error.message,
                hint: isInvalidKey
                    ? "Supabase API key is rejected. Check Vercel Environment Variables for SUPABASE_KEY / SUPABASE_ROLE_KEY. Make sure they match the correct Anon/Service-Role JWT key starting with 'eyJ' and have no surrounding quotes or spaces."
                    : undefined
            });
        }

        const token = data.session.access_token;

        // Ambil role user dari tabel users
        const { data: userData, error: dbError } = await supabase
            .from('users')
            .select('role, name')
            .eq('email', email)
            .single();

        res.status(200).json({
            message: "Login Berhasil!",
            token: token,
            user: {
                email: email,
                name: userData?.name || email,
                role: userData?.role || 'customer'
            }
        })
    } catch (err) {
        console.error("loginUser critical error:", err);
        res.status(500).json({
            error: err.message || "Terjadi kesalahan internal pada proses login.",
            hint: "Check server logs for SUPABASE DIAGNOSTIC INITIALIZATION to inspect env variables loaded by Vercel."
        });
    }
}

export { getUser, createUser, editUser, deleteUser, loginUser, registerUser };