import express from 'express';
import {
    createNewOrder,
    getMyOrders,
    getSingleOrder,
    updateStatus,
    getSupplierOrders
} from '../controllers/order.controller.js';

import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// 1. Create a New Order 
// Only a 'Buyer' should be allowed to place an order
router.post('/create', protect, authorize('Buyer'), createNewOrder);

// 2. Get Buyer's Orders
router.get('/my-orders', protect, authorize('Buyer'), getMyOrders);

// 3. Get Details of a Single Order
router.get('/:id', protect, authorize('Buyer', 'Transporter', 'WarehouseManager', 'SuperAdmin'), getSingleOrder);

// 4. Update Order Status
// Buyers CANNOT update status. Only the people handling the physical goods can update this!
router.patch('/:id/status', protect, authorize('Transporter', 'WarehouseManager', 'SuperAdmin'), updateStatus);

// 5. Get Supplier's Orders
// Only a 'Supplier' needs to see the orders placed for their products
router.get('/supplier-orders', protect, authorize('Supplier'), getSupplierOrders);

export default router;
