import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    capacity: {
        type: Number,
        required: true,
        default: 1000 // default capacity unit
    },
    inventory: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        }
    }]
}, { timestamps: true });

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
export default Warehouse;
