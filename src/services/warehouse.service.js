import Warehouse from "../models/warehouse.model.js";

// 1. Create a new warehouse (Admin)
export const createWarehouse = async (data) => {
    const warehouse = await Warehouse.create(data);
    if (!warehouse) {
        throw new Error('Failed to create warehouse');
    }
    return warehouse;
};

// 2. Get all warehouses
export const getAllWarehouses = async () => {
    const warehouses = await Warehouse.find()
        .populate('managerId', 'name email')
        .sort({ createdAt: -1 });
    return warehouses;
};

// 3. Get specific warehouse by ID
export const getWarehouseById = async (id) => {
    const warehouse = await Warehouse.findById(id)
        .populate('managerId', 'name email')
        .populate('inventory.productId');
        
    if (!warehouse) {
        throw new Error('Warehouse not found');
    }
    return warehouse;
};

// 4. Update Inventory (Add or Remove stock)
export const updateInventory = async (warehouseId, productId, quantity, operation) => {
    if (!['ADD', 'REMOVE'].includes(operation)) {
        throw new Error('Invalid operation. Must be ADD or REMOVE');
    }

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
        throw new Error('Warehouse not found');
    }

    // Find if product already exists in inventory
    const inventoryIndex = warehouse.inventory.findIndex(
        (item) => item.productId.toString() === productId.toString()
    );

    if (inventoryIndex > -1) {
        // Product exists
        if (operation === 'ADD') {
            warehouse.inventory[inventoryIndex].quantity += quantity;
        } else if (operation === 'REMOVE') {
            if (warehouse.inventory[inventoryIndex].quantity < quantity) {
                throw new Error('Insufficient inventory quantity to remove');
            }
            warehouse.inventory[inventoryIndex].quantity -= quantity;
        }
    } else {
        // Product does not exist in this warehouse yet
        if (operation === 'ADD') {
            warehouse.inventory.push({ productId, quantity });
        } else if (operation === 'REMOVE') {
            throw new Error('Product not found in this warehouse inventory to remove');
        }
    }

    // Check capacity before saving
    let currentTotalInventory = 0;
    warehouse.inventory.forEach(item => {
        currentTotalInventory += item.quantity;
    });

    if (currentTotalInventory > warehouse.capacity) {
        throw new Error(`Cannot add inventory. Warehouse capacity of ${warehouse.capacity} exceeded.`);
    }

    await warehouse.save();
    return warehouse;
};
