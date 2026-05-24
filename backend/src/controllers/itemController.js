import { supabase } from "../../config/supabaseClient.js";
import { uploadBase64ToSupabase } from "../utils/uploadImage.js";

const getItem = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized. Please configure SUPABASE_URL and SUPABASE_KEY in Vercel Environment Variables!" });
    }
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
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized. Please configure SUPABASE_URL and SUPABASE_KEY in Vercel Environment Variables!" });
    }
    try {
        const { name, media_url } = req.body;
        let finalMediaUrl = Array.isArray(media_url) ? media_url[0] : media_url;
        
        if (finalMediaUrl && finalMediaUrl.startsWith('data:image')) {
            finalMediaUrl = await uploadBase64ToSupabase(finalMediaUrl, 'item');
        }

        const { data, error } = await supabase.from('items').insert([{ name, media_url: [finalMediaUrl] }]).select();
        if (error) {
            console.error("Supabase INSERT items error:", error);
            return res.status(400).json({ error: error.message });
        }
        res.status(201).json({ message: "Berhasil membuat item", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const editItem = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized. Please configure SUPABASE_URL and SUPABASE_KEY in Vercel Environment Variables!" });
    }
    try {
        const { id } = req.params;
        const { name, media_url } = req.body;
        let finalMediaUrl = Array.isArray(media_url) ? media_url[0] : media_url;
        
        if (finalMediaUrl && finalMediaUrl.startsWith('data:image')) {
            finalMediaUrl = await uploadBase64ToSupabase(finalMediaUrl, 'item');
        }

        const { data, error } = await supabase.from('items').update({ name, media_url: [finalMediaUrl] }).eq('id', id).select();
        if (error) {
            console.error("Supabase UPDATE items error:", error);
            return res.status(400).json({ error: error.message });
        }
        res.status(200).json({ message: "Berhasil mengedit item", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const deleteItem = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized. Please configure SUPABASE_URL and SUPABASE_KEY in Vercel Environment Variables!" });
    }
    const { id } = req.params;
    const { error } = await supabase.from('items').delete().eq("id", id);
    if (error) {
        console.error("Supabase DELETE items error:", error);
        return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ message: "Berhasil delete item" });
}

export { getItem, createItem, editItem, deleteItem };