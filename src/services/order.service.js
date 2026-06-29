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
export const updateOrderStatus = async (orderId, status) => {
    const validStatuses = ['PENDING', 'ACCEPTED', 'IN_TRANSIT_TO_WAREHOUSE', 'AT_WAREHOUSE', 'OUT_FOR_DELIVERY', 'DELIVERED'];

    if (!validStatuses.includes(status)) {
        throw new Error('Invalid order status');
    }
    const order = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus: status },
        { new: true, runValidators: true }
    );
    if (!order) {
        throw new Error('Order not found');
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