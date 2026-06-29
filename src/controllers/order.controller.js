import {
    createOrder,
    getOrderByBuyer,
    getOrderById,
    updateOrderStatus,
    getOrdersBySupplier
} from '../services/order.service.js';

// 1. Create a new order (Usually called by a Buyer)
export const createNewOrder = async (req, res) => {
    try {
        // We assume req.user._id is populated by your auth middleware
        const orderData = {
            ...req.body,
            buyerId: req.user._id
        };

        const result = await createOrder(orderData);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 2. Get all orders for the currently logged-in buyer
export const getMyOrders = async (req, res) => {
    try {
        // Fetch orders where buyerId matches the logged-in user
        const orders = await getOrderByBuyer(req.user._id);
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// 3. Get details of a single specific order
export const getSingleOrder = async (req, res) => {
    try {
        // The ID will come from the URL parameters (e.g., /api/orders/:id)
        const { id } = req.params;
        const order = await getOrderById(id);

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

// 4. Update the status of an order (Usually called by Transporter/Admin)
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expecting { "status": "Shipped" } in the request body

        const updatedOrder = await updateOrderStatus(id, status);

        res.status(200).json({ success: true, message: 'Order status updated successfully', data: updatedOrder });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 5. Get all orders for the currently logged-in supplier
export const getSupplierOrders = async (req, res) => {
    try {
        // Fetch orders where supplierId matches the logged-in user
        const orders = await getOrdersBySupplier(req.user._id);
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};