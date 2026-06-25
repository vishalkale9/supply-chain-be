import { createProductService, transferProductService, getAllProductsService, getMyProductsService } from "../services/product.service.js";

// 1. Create a Batch (Supplier Only)
export const createProduct = async (req, res) => {
    try {
        const result = await createProductService(req.body, req.user.id);
        res.status(201).json({ success: true, data: result })
    } catch (error) {
        res.status(400).json({ sucess: false, message: error.message })
    }
};


// 2 transfer the product

export const transferProduct = async (req, res) => {
    try {
        const { productId, newOwnerId, statusUpdate } = req.body;
        const product = await transferProductService(
            productId,
            newOwnerId,
            statusUpdate,
            req.user.id
        );
        res.status(200).json({ success: true, message: 'Product transferred successfully', data: product });

    } catch (error) {
        res.status(403).json({ sucess: false, message: error.message });
    }
}

// 3 view all products (buyer)
export const getAllProducts = async (req, res) => {
    try {
        const products = await getAllProductsService();
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};



// 4. Get My Products (For Supplier/Transporter Dashboard)
export const getMyProducts = async (req, res) => {
    try {
        const products = await getMyProductsService(req.user._id);
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
