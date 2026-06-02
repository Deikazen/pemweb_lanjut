import express from 'express';
import { checkout, getAllOrders, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { verifyAdmin } from '../../middleware/verifyAdmin.js';

const router = express.Router();

// --- Rute untuk Customer ---
router.get('/', getOrders);        // Untuk melihat riwayat order
router.post('/checkout', checkout); // Untuk tombol "Checkout"


// --- Rute untuk Admin Panel ---
router.get('/all', verifyAdmin, getAllOrders);
router.put('/:id/status', verifyAdmin, updateOrderStatus);

export default router;