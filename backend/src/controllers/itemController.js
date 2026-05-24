import { supabase } from "../../config/supabaseClient.js";

const getItem = async (req, res) => {
    console.log("getItem Supabase Config:", { 
        SUPABASE_URL: process.env.SUPABASE_URL, 
        SUPABASE_KEY_START: process.env.SUPABASE_KEY ? process.env.SUPABASE_KEY.substring(0, 15) + "..." : "MISSING",
        SUPABASE_KEY_LEN: process.env.SUPABASE_KEY ? process.env.SUPABASE_KEY.length : 0
    });
    const { data, error } = await supabase.from('items').select('*');
    console.log("getItem query result:", {
        dataLength: data ? data.length : "null",
        error: error || "null",
        rawData: data
    });
    if (error) {
        console.error("Supabase SELECT items error:", error);
        return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ message: "Berhasil mengambil item", data });
}

const createItem = async (req, res) => {
    const { name, media_url } = req.body;
    const { data, error } = await supabase.from('items').insert([{ name, media_url }]).select();
    if (error) {
        console.error("Supabase INSERT items error:", error);
        return res.status(400).json({ error: error.message });
    }
    res.status(201).json({ message: "Berhasil membuat item", data });
}

const editItem = async (req, res) => {
    const { id } = req.params;
    const { name, media_url } = req.body;
    const { data, error } = await supabase.from('items').update({ name, media_url }).eq('id', id).select();
    if (error) {
        console.error("Supabase UPDATE items error:", error);
        return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ message: "Berhasil mengedit item", data });
}

const deleteItem = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('items').delete().eq("id", id);
    if (error) {
        console.error("Supabase DELETE items error:", error);
        return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ message: "Berhasil delete item" });
}

export { getItem, createItem, editItem, deleteItem };