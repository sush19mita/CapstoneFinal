exports.validateBooking = (data) => {
    if (!data.customerId || !data.customerEmail) {
        throw new Error("Customer details missing");
    }
};