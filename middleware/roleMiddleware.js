// Checks the user's role from the JWT token[cite: 1]
exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            // Returns 403 Forbidden for unauthorized access attempts[cite: 1]
            return res.status(403).json({ message: '403 Forbidden: You do not have permission to perform this action' });
        }
        next();
    };
};