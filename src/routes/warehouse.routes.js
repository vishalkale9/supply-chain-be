import express from 'express';
import {
    createNewWarehouse,
    getWarehouses,
    getSingleWarehouse,
    updateWarehouseInventory
} from '../controllers/warehouse.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Routes
router.post('/', protect, authorize('SuperAdmin', 'Admin'), createNewWarehouse);
router.get('/', protect, getWarehouses);
router.get('/:id', protect, getSingleWarehouse);
router.put('/:id/inventory', protect, authorize('SuperAdmin', 'Admin', 'WarehouseManager'), updateWarehouseInventory);

export default router;
