import { supabase } from "../../config/supabaseClient.js";
import midtransClient from "midtrans-client";

// Inisialisasi Midtrans Snap
const snap = new midtransClient.Snap({
    isProduction: false, // Set ke true jika sudah menggunakan akun Production
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});




// 1. Proses Checkout (Membuat Pesanan)
const checkout = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized." });
    }

    try {
        const user_id = req.user?.id || req.body.user_id;

        if (!user_id) {
            return res.status(400).json({ error: "User ID diperlukan untuk checkout" });
        }

        // Langkah 1: Ambil data keranjang user beserta harga barang saat ini
        const { data: cartItems, error: cartError } = await supabase
            .from('cart_items')
            .select(`
                id,
                item_id,
                quantity,
                items ( id, price, name )
            `)
            .eq('user_id', user_id);

        if (cartError) throw new Error(cartError.message);

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: "Keranjang belanja kosong. Tidak bisa checkout." });
        }

        // Langkah 2: Hitung total harga dan siapkan data array untuk di-insert ke order_items
        let totalPrice = 0;
        const orderItemsPayload = [];

        cartItems.forEach(cart => {
            const itemPrice = cart.items.price;
            totalPrice += (itemPrice * cart.quantity);
        });

        // Langkah 3: Buat data transaksi utama di tabel 'orders'
        const { data: newOrder, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: user_id,
                total_price: totalPrice,
                status: 'belum bayar' // Status awal pesanan
            }])
            .select()
            .single(); // Kita pakai .single() agar Supabase mengembalikan 1 objek langsung, bukan array

        if (orderError) throw new Error(orderError.message);

        const orderId = newOrder.id;

        // Langkah 4: Format array payload untuk 'order_items'
        cartItems.forEach(cart => {
            orderItemsPayload.push({
                order_id: orderId,
                item_id: cart.item_id,
                quantity: cart.quantity,
                price_at_time: cart.items.price // Simpan harga statis saat checkout
            });
        });

        // Langkah 5: Insert massal (bulk insert) ke tabel 'order_items'
        const { error: orderItemsError } = await supabase
            .from('order_items')
            .insert(orderItemsPayload);

        if (orderItemsError) throw new Error(orderItemsError.message);

        // Langkah 6: Jika semua sukses, hapus barang di keranjang user
        const { error: deleteCartError } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user_id);

        if (deleteCartError) throw new Error(deleteCartError.message);

        const midtransParams = {
            transaction_details: {
                order_id: orderId.toString(),
                gross_amount: totalPrice
            },
            credit_card: {
                secure: true
            },
        };

        const midtransTransaction = await snap.createTransaction(midtransParams);

        res.status(201).json({
            message: "Checkout berhasil dilakukan!",
            order_summary: newOrder,
            token: midtransTransaction.token,
            redirect_url: midtransTransaction.redirect_url
        });

    } catch (err) {
        console.error("Checkout Error:", err);
        res.status(500).json({ error: err.message || "Terjadi kesalahan saat memproses checkout" });
    }

}

// Tambahkan Fungsi Baru untuk Menangani Webhook Notifikasi Midtrans
const paymentNotification = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized." });
    }

    try {
        const notificationData = req.body;

        // Ambil status transaksi dari payload Midtrans
        const orderId = notificationData.order_id;
        const transactionStatus = notificationData.transaction_status;
        const fraudStatus = notificationData.fraud_status;

        // Tentukan pemetaan status transaksi ke sistem status internal kamu
        // Pilihan status internal kamu: ['belum bayar', 'diproses', 'selesai', 'dibatalkan']
        let updatedStatus = 'belum bayar';

        if (transactionStatus === 'capture') {
            if (fraudStatus === 'challenge') {
                updatedStatus = 'belum bayar'; // Memerlukan review manual
            } else if (fraudStatus === 'accept') {
                updatedStatus = 'diproses';    // Pembayaran sukses kartu kredit
            }
        } else if (transactionStatus === 'settlement') {
            updatedStatus = 'diproses';        // Pembayaran sukses (Gopay/Transfer Bank/dll)
        } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
            updatedStatus = 'dibatalkan';      // Gagal atau kedaluwarsa
        } else if (transactionStatus === 'pending') {
            updatedStatus = 'belum bayar';     // Menunggu pembayaran
        }

        // Perbarui status pesanan di database Supabase
        const { error } = await supabase
            .from('orders')
            .update({ status: updatedStatus })
            .eq('id', orderId);

        if (error) throw new Error(error.message);

        // Midtrans membutuhkan respon HTTP 200 OK untuk mengonfirmasi webhook diterima
        res.status(200).json({ message: "Notifikasi pembayaran berhasil diproses!" });

    } catch (err) {
        console.error("Midtrans Notification Error:", err);
        res.status(500).json({ error: err.message });
    }
}

// 2. Melihat Riwayat Pesanan User
const getOrders = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized." });
    }

    try {
        const user_id = req.user?.id || req.query.user_id || req.body.user_id;

        if (!user_id) {
            return res.status(400).json({ error: "User ID diperlukan" });
        }

        // Mengambil orders sekaligus JOIN ke order_items dan items (Nested Join)
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    id,
                    quantity,
                    price_at_time,
                    items ( name, media_url )
                )
            `)
            .eq('user_id', user_id)
            .order('created_at', { ascending: false }); // Urutkan dari pesanan terbaru

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: "Berhasil mengambil riwayat pesanan", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



// ------ Untuk Admin Panel -------

const getAllOrders = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized." });
    }

    try {
        // Mengambil semua orders tanpa filter user_id, diurutkan dari terbaru
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    id,
                    quantity,
                    price_at_time,
                    items ( name, media_url )
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: "Berhasil mengambil semua pesanan", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 4. Mengubah Status Pesanan (Untuk Admin Panel)
const updateOrderStatus = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized." });
    }

    try {
        const { id } = req.params; // Mengambil ID pesanan dari URL
        const { status } = req.body; // Mengambil status baru dari body request

        if (!status) {
            return res.status(400).json({ error: "Status baru diperlukan" });
        }

        // Validasi status — hanya 4 kategori yang berlaku
        const validStatuses = ['belum bayar', 'diproses', 'selesai', 'dibatalkan'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Status tidak valid. Pilihan: ${validStatuses.join(', ')}` });
        }

        // Update status di database Supabase
        const { data, error } = await supabase
            .from('orders')
            .update({ status: status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: "Status pesanan berhasil diperbarui!", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 5. Batalkan Pesanan (Untuk Customer)
// Hanya boleh dibatalkan jika status masih 'belum bayar'
const cancelOrder = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized." });
    }

    try {
        const { id } = req.params;
        const user_id = req.user?.id;

        if (!user_id) {
            return res.status(401).json({ error: "User tidak terautentikasi" });
        }

        // Ambil pesanan, pastikan milik user ini
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('id, status, user_id')
            .eq('id', id)
            .single();

        if (fetchError || !order) {
            return res.status(404).json({ error: "Pesanan tidak ditemukan" });
        }

        // Pastikan pesanan ini milik customer yang login
        if (order.user_id !== user_id) {
            return res.status(403).json({ error: "Anda tidak berhak membatalkan pesanan ini" });
        }

        // Hanya boleh dibatalkan jika status masih 'belum bayar'
        if (order.status !== 'belum bayar') {
            return res.status(400).json({
                error: `Pesanan tidak dapat dibatalkan karena statusnya sudah '${order.status}'. Pembatalan hanya bisa dilakukan saat status 'belum bayar'.`
            });
        }

        const { data, error } = await supabase
            .from('orders')
            .update({ status: 'dibatalkan' })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: "Pesanan berhasil dibatalkan.", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 6. Konfirmasi Pesanan Selesai (Untuk Customer)
// Hanya bisa dilakukan jika status sudah 'diproses' (sudah ditangani admin)
const completeOrder = async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client is not initialized." });
    }

    try {
        const { id } = req.params;
        const user_id = req.user?.id;

        if (!user_id) {
            return res.status(401).json({ error: "User tidak terautentikasi" });
        }

        // Ambil pesanan, pastikan milik user ini
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('id, status, user_id')
            .eq('id', id)
            .single();

        if (fetchError || !order) {
            return res.status(404).json({ error: "Pesanan tidak ditemukan" });
        }

        // Pastikan pesanan ini milik customer yang login
        if (order.user_id !== user_id) {
            return res.status(403).json({ error: "Anda tidak berhak mengkonfirmasi pesanan ini" });
        }

        // Hanya bisa dikonfirmasi selesai jika status 'diproses'
        if (order.status !== 'diproses') {
            return res.status(400).json({
                error: `Pesanan belum bisa dikonfirmasi selesai. Status saat ini: '${order.status}'.`
            });
        }

        const { data, error } = await supabase
            .from('orders')
            .update({ status: 'selesai' })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: "Pesanan dikonfirmasi selesai!", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export { checkout, getOrders, getAllOrders, updateOrderStatus, cancelOrder, completeOrder, paymentNotification };