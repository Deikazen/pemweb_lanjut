import { supabase } from "../../config/supabaseClient.js";

// 1. Mengambil isi keranjang user
const getCart = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized." });
    }

    try {
        // ID user idealnya didapat dari token JWT via middleware (req.user.id)
        // Sebagai fallback/testing, kita bisa ambil dari query atau body
        const user_id = req.user?.id;

        if (!user_id) {
            return res.status(400).json({ error: "User ID diperlukan untuk melihat keranjang" });
        }

        // Mengambil data cart_items sekaligus melakukan JOIN ke tabel items
        const { data, error } = await supabase
            .from('cart_items')
            .select(`
                id,
                user_id,
                quantity,
                item_id,
                items (
                    id,
                    name,
                    price,
                    media_url
                )
            `)
            .eq('user_id', user_id);

        if (error) {
            console.error("Supabase GET cart error:", error);
            return res.status(400).json({ error: error.message });
        }
        console.log('berhasil get cart')
        res.status(200).json({ message: "Berhasil mengambil keranjang", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 2. Menambah barang ke keranjang
const addToCart = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized." });
    }

    try {
        const user_id = req.user?.id || req.body.user_id;
        const { item_id, quantity = 1 } = req.body;

        if (!user_id || !item_id) {
            return res.status(400).json({ error: "User ID dan Item ID wajib diisi" });
        }

        // Cek apakah item ini sudah ada di keranjang user yang bersangkutan
        const { data: existingItem, error: checkError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user_id)
            .eq('item_id', item_id)
            .maybeSingle(); // maybeSingle tidak akan melempar error jika data kosong (not found)

        if (checkError) {
            console.error("Supabase CHECK cart error:", checkError);
            return res.status(400).json({ error: checkError.message });
        }

        if (existingItem) {
            // Jika sudah ada, update quantity-nya saja
            const newQuantity = existingItem.quantity + parseInt(quantity);
            const { data, error } = await supabase
                .from('cart_items')
                .update({ quantity: newQuantity })
                .eq('id', existingItem.id)
                .select();

            if (error) return res.status(400).json({ error: error.message });
            return res.status(200).json({ message: "Kuantitas barang di keranjang berhasil diperbarui", data });

        } else {
            // Jika belum ada, buat entri baru di keranjang
            const { data, error } = await supabase
                .from('cart_items')
                .insert([{ user_id, item_id, quantity: parseInt(quantity) }])
                .select();

            if (error) return res.status(400).json({ error: error.message });
            return res.status(201).json({ message: "Barang berhasil ditambahkan ke keranjang", data });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 3. Menghapus satu item dari keranjang
const removeFromCart = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized." });
    }

    try {
        const { id } = req.params; // Ini adalah ID dari tabel cart_items, BUKAN item_id

        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Supabase DELETE cart_item error:", error);
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: "Berhasil menghapus barang dari keranjang" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export { getCart, addToCart, removeFromCart };