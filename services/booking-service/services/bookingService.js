const Booking = require('../models/Booking');
const Budget = require('../models/Budget');

exports.createBooking = async (data) => {
    if (!data.customerId || !data.eventId || !data.totalAmount) {
        throw new Error("Missing required fields");
    }

    const booking = new Booking(data);
    await booking.save();

    // Increase revenue
    await Budget.findOneAndUpdate(
        { vendorId: data.vendorId, eventId: data.eventId },
        { $inc: { revenue: data.totalAmount } },
        { upsert: true }
    );

    return booking;
};

exports.getCustomerBookings = async (customerId) => {
    return Booking.find({ customerId }).sort({ bookedAt: -1 });
};

exports.getVendorBookings = async (vendorId) => {
    return Booking.find({ vendorId }).sort({ bookedAt: -1 });
};

exports.getAllBookings = async () => {
    return Booking.find().sort({ bookedAt: -1 });
};

exports.cancelBooking = async (id) => {
    const booking = await Booking.findById(id);

    if (!booking) throw new Error("Booking not found");

    if (booking.status === 'cancelled') return booking;

    booking.status = 'cancelled';
    await booking.save();

    // Reduce revenue
    await Budget.findOneAndUpdate(
        { vendorId: booking.vendorId, eventId: booking.eventId },
        { $inc: { revenue: -booking.totalAmount } }
    );

    return booking;
};