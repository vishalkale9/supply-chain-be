import Transport from "../models/transport.model.js";
import Order from "../models/order.model.js";

export const createShipment = async (shipmentData) => {
    const order = await Order.findById(shipmentData.orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    const shipment = await Transport.create(shipmentData);
    if (!shipment) {
        throw new Error('Failed to create shipment');
    }
    return shipment;
};

export const getShipmentById = async (id) => {
    const shipment = await Transport.findById(id)
        .populate('orderId')
        .populate('transporterId', 'name email');
    if (!shipment) {
        throw new Error('Shipment not found');
    }
    return shipment;
};

export const getShipmentByOrderId = async (orderId) => {
    const shipment = await Transport.findOne({ orderId })
        .populate('transporterId', 'name email');
    if (!shipment) {
        throw new Error('Shipment not found for this order');
    }
    return shipment;
};

export const getShipmentsByTransporter = async (transporterId) => {
    const shipments = await Transport.find({ transporterId })
        .populate('orderId')
        .sort({ createdAt: -1 });
    return shipments;
};

export const updateShipmentStatus = async (id, status, userRole) => {
    const validStatuses = ['PENDING', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED'];
    if (!validStatuses.includes(status)) {
        throw new Error('Invalid shipment status');
    }

    const shipment = await Transport.findById(id).populate('orderId');
    if (!shipment) {
        throw new Error('Shipment not found');
    }

    let isAuthorized = false;
    if (userRole === 'SuperAdmin') {
        isAuthorized = true;
    } else if (userRole === 'Transporter' || userRole === 'Admin' || userRole === 'WarehouseManager') {
        // Transporters can update any status
        isAuthorized = true; 
    }

    if (!isAuthorized) {
        throw new Error('Unauthorized to update shipment status');
    }

    shipment.status = status;
    
    if (status === 'DELIVERED') {
        shipment.actualDeliveryDate = new Date();
        // Also update order status
        shipment.orderId.orderStatus = 'DELIVERED';
        await shipment.orderId.save();
    }
    
    await shipment.save();

    // Publish event to RabbitMQ
    try {
        const { publishMessage } = await import('../utils/rabbitmq.js');
        const notificationPayload = {
            userId: shipment.orderId.buyerId, 
            message: `Your shipment tracking ${shipment.trackingNumber} status is now ${status}`,
            orderId: shipment.orderId._id,
            type: 'SHIPMENT_UPDATE'
        };
        await publishMessage('notification_queue', notificationPayload);
    } catch (err) {
        console.error('Failed to publish notification:', err);
    }

    return shipment;
};
