const jwt = require('jsonwebtoken');

// Verifies JWT token and attaches user to request
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Assume token payload contains { id, role }
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};