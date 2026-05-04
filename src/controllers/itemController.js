import { supabase } from "../../config/supabaseClient.js";

const getItem = async (req, res) => {
    const { data, error } = await supabase.from('items').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Berhasil mengambil item", data });
}

const createItem = async (req, res) => {
    const { name } = req.body;
    const { data, error } = await supabase.from('items').insert([{ name }]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: "Berhasil membuat item", data });
}

const editItem = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const { data, error } = await supabase.from('items').update({ name }).eq('id', id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Berhasil mengedit item", data });
}

const deleteItem = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('items').delete().eq("id", id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Berhasil delete item" });
}

export { getItem, createItem, editItem, deleteItem };