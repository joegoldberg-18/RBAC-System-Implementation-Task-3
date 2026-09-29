const Product = require('../models/Product');

// Get all records with Pagination and Filtering[cite: 1]
exports.getProducts = async (req, res) => {
    try {
        // Pagination logic[cite: 1]
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Search/filter logic using MongoDB queries[cite: 1]
        const query = {};
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' }; // Case-insensitive search
        }
        if (req.query.category) {
            query.category = req.query.category;
        }

        const products = await Product.find(query).skip(skip).limit(limit);
        const total = await Product.countDocuments(query);

        res.status(200).json({
            total,
            page,
            pages: Math.ceil(total / limit),
            data: products
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a resource
exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product({
            ...req.body,
            owner: req.user.id // Attach the user ID from JWT
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a resource
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Admin can update any resource, User can only update their own[cite: 1]
        if (req.user.role !== 'Admin' && product.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: '403 Forbidden: You can only update your own data' }); //[cite: 1]
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a resource
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Admin can delete any resource, User can only delete their own[cite: 1]
        if (req.user.role !== 'Admin' && product.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: '403 Forbidden: You can only delete your own data' }); //[cite: 1]
        }

        await product.deleteOne();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};