import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    // 1. Who is buying it? (The Buyer)
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // 2. What exact box are they buying? (The Batch)
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    // 2.5 Who is supplying it? (The Supplier)
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // 3. Where should the Transporter take it?
    shippingAddress: {
        type: String,
        required: [true, 'Please provide a shipping address'],
        trim: true
    },

    // 4. What is the status of the order?
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
        default: 'Pending'
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
