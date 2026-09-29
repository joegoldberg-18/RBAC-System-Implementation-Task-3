const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['User', 'Admin'], // Defines the multiple user roles
        default: 'User' 
    }
});

module.exports = mongoose.model('User', userSchema);