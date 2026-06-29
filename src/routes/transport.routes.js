import express from 'express';
import {
    createNewShipment,
    getSingleShipment,
    getOrderShipment,
    getMyShipments,
    updateStatus
} from '../controllers/transport.controller.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Routes for Transporters and Admins
router.post('/', verifyToken, authorizeRoles('SuperAdmin', 'Admin', 'Transporter', 'WarehouseManager'), createNewShipment);
router.get('/transporter', verifyToken, authorizeRoles('Transporter', 'SuperAdmin', 'Admin'), getMyShipments);
router.put('/:id/status', verifyToken, authorizeRoles('Transporter', 'SuperAdmin', 'Admin', 'WarehouseManager'), updateStatus);

// Routes for viewing by any authenticated user (e.g. Buyer checking their order)
router.get('/:id', verifyToken, getSingleShipment);
router.get('/order/:orderId', verifyToken, getOrderShipment);

export default router;
