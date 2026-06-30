import express from 'express';
import {
    createNewShipment,
    getSingleShipment,
    getOrderShipment,
    getMyShipments,
    updateStatus
} from '../controllers/transport.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Routes for Transporters and Admins
router.post('/', protect, authorize('SuperAdmin', 'Admin', 'Transporter', 'WarehouseManager'), createNewShipment);
router.get('/transporter', protect, authorize('Transporter', 'SuperAdmin', 'Admin'), getMyShipments);
router.put('/:id/status', protect, authorize('Transporter', 'SuperAdmin', 'Admin', 'WarehouseManager'), updateStatus);

// Routes for viewing by any authenticated user (e.g. Buyer checking their order)
router.get('/:id', protect, getSingleShipment);
router.get('/order/:orderId', protect, getOrderShipment);

export default router;
