import express from 'express';
import { checkout, getAllOrders, getOrders, updateOrderStatus, cancelOrder, completeOrder } from '../controllers/orderController.js';
import { verifyAdmin } from '../../middleware/verifyAdmin.js';
import { verifyToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

// --- Rute untuk Customer ---
router.get('/', verifyToken, getOrders);               // Lihat riwayat order
router.post('/checkout', verifyToken, checkout);        // Tombol "Checkout"
router.put('/:id/cancel', verifyToken, cancelOrder);   // Batalkan order (hanya jika 'belum bayar')
router.put('/:id/complete', verifyToken, completeOrder); // Konfirmasi selesai (hanya jika 'diproses')

// --- Rute untuk Admin Panel ---
router.get('/all', verifyAdmin, getAllOrders);
router.put('/:id/status', verifyAdmin, updateOrderStatus);

export default router;