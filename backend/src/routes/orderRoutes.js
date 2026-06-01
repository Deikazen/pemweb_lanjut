import express from 'express';
import { checkout, getOrders } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getOrders);        // Untuk melihat riwayat order
router.post('/checkout', checkout); // Untuk tombol "Checkout"

export default router;