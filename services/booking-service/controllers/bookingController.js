const bookingService = require('../services/bookingService');

exports.createBooking = async (req, res) => {
    try {
        const booking = await bookingService.createBooking(req.body);
        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getCustomerBookings = async (req, res) => {
    const bookings = await bookingService.getCustomerBookings(req.params.customerId);
    res.json(bookings);
};

exports.getVendorBookings = async (req, res) => {
    const bookings = await bookingService.getVendorBookings(req.params.vendorId);
    res.json(bookings);
};

exports.getAllBookings = async (req, res) => {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await bookingService.cancelBooking(req.params.id);
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
