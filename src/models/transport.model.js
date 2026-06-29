import mongoose from "mongoose";

const transportSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    transporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The user assigned to transport this
        required: true
    },
    carrierName: {
        type: String,
        required: true,
        default: 'Internal Fleet'
    },
    trackingNumber: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED'],
        default: 'PENDING'
    },
    originAddress: {
        type: String,
        required: true
    },
    destinationAddress: {
        type: String,
        required: true
    },
    estimatedDeliveryDate: {
        type: Date
    },
    actualDeliveryDate: {
        type: Date
    }
}, { timestamps: true });

const Transport = mongoose.model('Transport', transportSchema);
export default Transport;
