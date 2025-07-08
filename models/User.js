const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    document: String,
    status: { type: String, default: 'Pending' }, // Pending, Approved, Rejected
    remarks: String
});

module.exports = mongoose.model('User', userSchema);
