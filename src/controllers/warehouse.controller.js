import {
    createWarehouse,
    getAllWarehouses,
    getWarehouseById,
    updateInventory
} from '../services/warehouse.service.js';

export const createNewWarehouse = async (req, res) => {
    try {
        const warehouseData = req.body;
        const result = await createWarehouse(warehouseData);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getWarehouses = async (req, res) => {
    try {
        const warehouses = await getAllWarehouses();
        res.status(200).json({ success: true, count: warehouses.length, data: warehouses });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getSingleWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        const warehouse = await getWarehouseById(id);
        res.status(200).json({ success: true, data: warehouse });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const updateWarehouseInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId, quantity, operation } = req.body;

        // Optionally, check if req.user._id is the actual manager of THIS warehouse
        // We will assume `authorizeRoles` handled general permissions

        const updatedWarehouse = await updateInventory(id, productId, quantity, operation);
        res.status(200).json({ success: true, message: 'Inventory updated', data: updatedWarehouse });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
