const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Budget = require('../models/Budget');

// Create booking
router.post('/', async (req, res) => {
    try {
        const {
            customerId,
            customerName,
            customerEmail,
            eventId,
            eventTitle,
            vendorId,
            totalAmount
        } = req.body;

        // ✅ Basic validation
        if (!customerId || !customerName || !customerEmail || !eventId || !vendorId || !totalAmount) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const booking = new Booking(req.body);
        await booking.save();

        // Update revenue
        await Budget.findOneAndUpdate(
            { vendorId, eventId },
            { $inc: { revenue: totalAmount } },
            { upsert: true, new: true }
        );

        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get bookings for a customer
router.get('/customer/:customerId', async (req, res) => {
    try {
        const bookings = await Booking.find({
            customerId: req.params.customerId
        }).sort({ bookedAt: -1 });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get bookings for a vendor
router.get('/vendor/:vendorId', async (req, res) => {
    try {
        const bookings = await Booking.find({
            vendorId: req.params.vendorId
        }).sort({ bookedAt: -1 });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all bookings (admin)
router.get('/admin/all', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ bookedAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cancel booking
router.put('/:id/cancel', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // ✅ Prevent double cancel
        if (booking.status === 'cancelled') {
            return res.json(booking);
        }

        booking.status = 'cancelled';
        await booking.save();

        // ✅ Reduce revenue
        await Budget.findOneAndUpdate(
            { vendorId: booking.vendorId, eventId: booking.eventId },
            { $inc: { revenue: -booking.totalAmount } }
        );

        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;