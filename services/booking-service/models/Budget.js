const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    vendorId: { type: String, required: true },
    eventId: { type: String, required: true },
    eventTitle: { type: String },
    totalBudget: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    expenses: [{
        label: String,
        amount: Number,
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Budget', budgetSchema);
