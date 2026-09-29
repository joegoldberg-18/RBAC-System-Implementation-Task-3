const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public or User route (Any authenticated user can view)
router.get('/', verifyToken, getProducts);

// Creation: Any authenticated user can create (Admin or User)
router.post('/', verifyToken, createProduct);

// Update/Delete: Both Admins and Users can access the route, 
// but the controller handles the ownership logic vs Admin override[cite: 1]
router.put('/:id', verifyToken, authorizeRoles('Admin', 'User'), updateProduct);
router.delete('/:id', verifyToken, authorizeRoles('Admin', 'User'), deleteProduct);

// Example of a strictly Admin-only route (if needed elsewhere)
// router.delete('/admin-only/:id', verifyToken, authorizeRoles('Admin'), someAdminControllerFunction);

module.exports = router;