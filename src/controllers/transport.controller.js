import {
    createShipment,
    getShipmentById,
    getShipmentByOrderId,
    getShipmentsByTransporter,
    updateShipmentStatus
} from '../services/transport.service.js';

export const createNewShipment = async (req, res) => {
    try {
        // req.user from auth middleware
        const shipmentData = {
            ...req.body,
            // default to logged-in user if transporter not provided, 
            // though usually an admin assigns it
            transporterId: req.body.transporterId || req.user._id 
        };
        
        const result = await createShipment(shipmentData);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getSingleShipment = async (req, res) => {
    try {
        const { id } = req.params;
        const shipment = await getShipmentById(id);
        res.status(200).json({ success: true, data: shipment });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const getOrderShipment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const shipment = await getShipmentByOrderId(orderId);
        res.status(200).json({ success: true, data: shipment });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const getMyShipments = async (req, res) => {
    try {
        const shipments = await getShipmentsByTransporter(req.user._id);
        res.status(200).json({ success: true, count: shipments.length, data: shipments });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userRole = req.user.role; 

        const updatedShipment = await updateShipmentStatus(id, status, userRole);
        res.status(200).json({ success: true, message: 'Shipment status updated', data: updatedShipment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
