import { supabase } from "../../config/supabaseClient.js";
import { uploadBase64ToSupabase } from "../utils/uploadImage.js";

const getItem = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized. Please configure SUPABASE_URL and SUPABASE_KEY in Vercel Environment Variables!" });
    }
    
    try {
        const { data: items, error: itemsError } = await supabase.from('items').select('*');
        if (itemsError) {
            console.error("Supabase SELECT items error:", itemsError);
            return res.status(400).json({ error: itemsError.message });
        }

        // Fetch all item metadata stored in settings
        const { data: metaSettings, error: metaError } = await supabase
            .from('settings')
            .select('*')
            .like('key', 'item_meta_%');

        // Map settings value to item ID
        const metaMap = {};
        if (metaSettings) {
            metaSettings.forEach(s => {
                const itemId = s.key.replace('item_meta_', '');
                try {
                    metaMap[itemId] = JSON.parse(s.value);
                } catch (e) {
                    metaMap[itemId] = {};
                }
            });
        }

        // Merge metadata into item array
        const mergedData = items.map(item => {
            const meta = metaMap[item.id] || {};
            return {
                ...item,
                description: meta.description || "",
                tags: Array.isArray(meta.tags) ? meta.tags : [],
                badge: meta.badge || ""
            };
        });

        res.status(200).json({ message: "Berhasil mengambil item", data: mergedData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const createItem = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized. Please configure SUPABASE_URL and SUPABASE_KEY in Vercel Environment Variables!" });
    }
    try {
        const { name, media_url, price, description, tags, badge } = req.body;
        let finalMediaUrl = Array.isArray(media_url) ? media_url[0] : media_url;

        if (finalMediaUrl && finalMediaUrl.startsWith('data:image')) {
            finalMediaUrl = await uploadBase64ToSupabase(finalMediaUrl, 'item');
        }

        const { data: itemData, error: itemError } = await supabase.from('items').insert([{ name, media_url: [finalMediaUrl], price }]).select();
        if (itemError) {
            console.error("Supabase INSERT items error:", itemError);
            return res.status(400).json({ error: itemError.message });
        }

        const newItem = itemData[0];
        
        // Save metadata to settings table
        const metaKey = `item_meta_${newItem.id}`;
        const metaValue = JSON.stringify({
            description: description || "",
            tags: Array.isArray(tags) ? tags : [],
            badge: badge || ""
        });

        const { error: metaError } = await supabase.from('settings').upsert([{ key: metaKey, value: metaValue }]);
        if (metaError) {
            console.error("Supabase UPSERT item metadata error:", metaError);
        }

        res.status(201).json({ 
            message: "Berhasil membuat item", 
            data: [{
                ...newItem,
                description: description || "",
                tags: Array.isArray(tags) ? tags : [],
                badge: badge || ""
            }] 
        });
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
        const { name, media_url, price, description, tags, badge } = req.body;
        let finalMediaUrl = Array.isArray(media_url) ? media_url[0] : media_url;

        if (finalMediaUrl && finalMediaUrl.startsWith('data:image')) {
            finalMediaUrl = await uploadBase64ToSupabase(finalMediaUrl, 'item');
        }

        const { data: itemData, error: itemError } = await supabase.from('items').update({ name, media_url: [finalMediaUrl], price }).eq('id', id).select();
        if (itemError) {
            console.error("Supabase UPDATE items error:", itemError);
            return res.status(400).json({ error: itemError.message });
        }

        const updatedItem = itemData[0];

        // Save/Update metadata in settings table
        const metaKey = `item_meta_${id}`;
        const metaValue = JSON.stringify({
            description: description || "",
            tags: Array.isArray(tags) ? tags : [],
            badge: badge || ""
        });

        const { error: metaError } = await supabase.from('settings').upsert([{ key: metaKey, value: metaValue }]);
        if (metaError) {
            console.error("Supabase UPSERT item metadata error:", metaError);
        }

        res.status(200).json({ 
            message: "Berhasil mengedit item", 
            data: [{
                ...updatedItem,
                description: description || "",
                tags: Array.isArray(tags) ? tags : [],
                badge: badge || ""
            }] 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const deleteItem = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized. Please configure SUPABASE_URL and SUPABASE_KEY in Vercel Environment Variables!" });
    }
    try {
        const { id } = req.params;
        const { error: itemError } = await supabase.from('items').delete().eq("id", id);
        if (itemError) {
            console.error("Supabase DELETE items error:", itemError);
            return res.status(400).json({ error: itemError.message });
        }

        // Clean up metadata in settings table
        const metaKey = `item_meta_${id}`;
        await supabase.from('settings').delete().eq("key", metaKey);

        res.status(200).json({ message: "Berhasil delete item" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export { getItem, createItem, editItem, deleteItem };