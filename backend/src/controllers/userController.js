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
    const { data, error } = await supabase.from('users').insert([{ name, email }]).select();
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

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const statelessClient = createStatelessClient();
        const { data, error } = await statelessClient.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) return res.status(401).json({ error: error.message });

        const token = data.session.access_token;

        res.status(200).json({
            message: "Login Berhasil!",
            token: token
        })
    } catch (err) {
        console.error("loginUser critical error:", err);
        res.status(500).json({ error: err.message || "Terjadi kesalahan internal pada proses login." });
    }
}

export { getUser, createUser, editUser, deleteUser, loginUser };