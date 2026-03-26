const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    eventId: { type: String, required: true },
    eventTitle: { type: String, required: true },
    vendorId: { type: String, required: true },
    ticketCount: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['confirmed', 'cancelled'], 
        default: 'confirmed' 
    },
    bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
