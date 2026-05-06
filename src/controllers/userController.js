import { supabase } from "../../config/supabaseClient.js";


const getUser = async (req, res) => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Berhasil mengambil data user", data });
}

const createUser = async (req, res) => {
    const { name, email } = req.body;
    const { data, error } = await supabase.from('users').insert([{ name, email }]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: "Berhasil membuat user", data });
}

const editUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const { data, error } = await supabase.from('users').update({ name, email }).eq('id', id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Berhasil mengedit user", data });
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('users').delete().eq("id", id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Berhasil delete User" });

}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    if (error) return res.status(401).json({ error: error.message });

    const token = data.session.access_token;

    res.status(200).json({
        message: "Login Berhasil!",
        token: token
    })
}

export { getUser, createUser, editUser, deleteUser, loginUser };