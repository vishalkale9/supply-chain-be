import Product from "../models/product.model.js";

//create the product 
export const createProductService = async (productData,
    userId) => {
    const product = await Product.create({
        ...productData,
        currentOwner: userId,
        history: [{
            from: userId,
            to: userId,
            status: 'Manufactured',
        }]
    })

    return product;
}

//transfer the product
export const transferProductService = async (productId, newOwnerId, statusUpdate, currentUserId) => {

    const product = await Product.findById(productId);

    if (!product)
        throw new Error('Product not found')

    if (product.currentOwner.toString() !== currentUserId.toString()) {
        throw new Error('You are not authorized to transfer this product')
    }

    //owner change
    product.currentOwner = newOwnerId;

    //history update
    product.history.push({
        from: currentUserId,
        to: newOwnerId,
        status: statusUpdate,
    })

    await product.save();
    return product;
}

//get all products for buyer to view
export const getAllProductsService = async () => {
    return await Product.find({ isActive: true })
        .populate('currentOwner', 'name role')
        .populate('history.from history.to', 'name role')
        .sort({ createdAt: -1 });
}


// get product by id 
export const getMyProductsService = async (userId) => {
    return await Product.find({ currentOwner: userId })
        .populate('history.from history.to', 'name role')
        .sort({ createdAt: -1 });
};
