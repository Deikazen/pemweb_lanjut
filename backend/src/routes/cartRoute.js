import express from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';
// import { verifyToken } from '../middleware/authMiddleware.js'; // Tambahkan ini nanti

const router = express.Router();

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:id', removeFromCart);

export default router;