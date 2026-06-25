import express from 'express';
import {
    createProduct,
    transferProduct,
    getAllProducts,
    getMyProducts
} from '../controllers/product.controller.js';

import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// 1.Create a Batch (Supplier Only)
router.post('/create', protect, authorize('Supplier'), createProduct);

// 2. Get Supplier/Transporter Inventory
router.get('/my-inventory', protect, getMyProducts);

// 3. Transfer a Product (The Ledger Handoff)
router.put('/transfer', protect, transferProduct);

// 4. View All Products (The Buyer's Catalog)
router.get('/', getAllProducts);

export default router;