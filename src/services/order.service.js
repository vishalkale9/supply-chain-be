import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// 1. Create a new order (Buyer action)
export const createOrder = async (orderData) => {
    //check product exists or not 
    const product = await Product.findById(orderData.productId);

    if (!product) {
        throw new Error('Product Not Found')
    }

    // Automatically set the supplierId based on who currently owns/made the product
    orderData.supplierId = product.currentOwner;

    const order = await Order.create(orderData);
    if (!order) {
        throw new Error('Failed to create order')
    }
    return order;

}

// 2. Get all orders for a specific buyer
export const getOrderByBuyer = async (buyerId) => {
    const orders = await Order.find({ buyerId: buyerId })
        .populate('productId', 'name description batchId')
        .sort({ createdAt: -1 })
    if (!orders) {
        throw new Error('Failed to fetch orders')
    }

    return orders;
}


// 3. Get details of a specific order by its ID
export const getOrderById = async (orderId) => {
    const order = await Order.findById(orderId)
        .populate('buyerId', 'name email') // Bring in buyer details
        .populate('productId'); // Bring in all product details

    if (!order) {
        throw new Error('Order not found');
    }
    return order;
};

// 4. Update the status of an order (e.g., when Transporter delivers it)
export const updateOrderStatus = async (orderId, status, userRole) => {
    const validStatuses = ['PENDING', 'ACCEPTED', 'IN_TRANSIT_TO_WAREHOUSE', 'AT_WAREHOUSE', 'OUT_FOR_DELIVERY', 'DELIVERED'];

    if (!validStatuses.includes(status)) {
        throw new Error('Invalid order status');
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    const currentState = order.orderStatus;
    let isAuthorized = false;

    // State Machine Rules based on Role
    if (userRole === 'SuperAdmin') {
        isAuthorized = true;
    } else if (userRole === 'Supplier') {
        if ((currentState === 'PENDING' && status === 'ACCEPTED') ||
            (currentState === 'ACCEPTED' && status === 'IN_TRANSIT_TO_WAREHOUSE')) {
            isAuthorized = true;
        }
    } else if (userRole === 'WarehouseManager') {
        if ((currentState === 'IN_TRANSIT_TO_WAREHOUSE' && status === 'AT_WAREHOUSE') ||
            (currentState === 'AT_WAREHOUSE' && status === 'OUT_FOR_DELIVERY')) {
            isAuthorized = true;
        }
    } else if (userRole === 'Transporter') {
        if (currentState === 'OUT_FOR_DELIVERY' && status === 'DELIVERED') {
            isAuthorized = true;
        }
    }

    if (!isAuthorized) {
        throw new Error(`Unauthorized transition: ${userRole} cannot move order from ${currentState} to ${status}`);
    }

    order.orderStatus = status;
    await order.save();

    // Publish event to RabbitMQ
    try {
        const { publishMessage } = await import('../utils/rabbitmq.js');
        const notificationPayload = {
            userId: order.buyerId, 
            message: `Your order status changed to ${status}`,
            orderId: order._id,
            type: 'ORDER_UPDATE'
        };
        await publishMessage('notification_queue', notificationPayload);
    } catch (err) {
        console.error('Failed to publish notification:', err);
    }

    return order;
};

// 5. Get all orders for a specific supplier
export const getOrdersBySupplier = async (supplierId) => {
    const orders = await Order.find({ supplierId: supplierId })
        .populate('productId', 'name description batchId')
        .populate('buyerId', 'name email') // Let the supplier see who bought it
        .sort({ createdAt: -1 });

    if (!orders) {
        throw new Error('Failed to fetch orders')
    }

    return orders;
}