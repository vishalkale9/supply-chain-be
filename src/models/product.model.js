import mongoose from "mongoose";

const historySchema= new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    
    status:{
        type:String,
        enum:['Manufactured','In Transit','In Warehouse','Delivered'],
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
})

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide the product name'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'Please provide the product description'],
        trim:true
    },
    currentOwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    history: [historySchema],
    isActive:
    {
        type: Boolean,
        default: true,
    },
    batchId: {
        type: String,
        required: [true, 'Please provide a unique Batch ID or SKU'],
        unique: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Please provide the quantity in this batch'],
        min: 1
    }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)
export default Product;