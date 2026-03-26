const Budget = require('../models/Budget');

// Get budgets for a vendor
exports.getVendorBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({
            vendorId: req.params.vendorId
        });
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create or update budget
exports.createOrUpdateBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndUpdate(
            {
                vendorId: req.body.vendorId,
                eventId: req.body.eventId
            },
            req.body,
            {
                upsert: true,
                new: true
            }
        );

        res.json(budget);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Add expense
exports.addExpense = async (req, res) => {
    try {
        const { label, amount } = req.body;

        if (!label || !amount) {
            return res.status(400).json({
                error: "Expense label and amount are required"
            });
        }

        const budget = await Budget.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    expenses: {
                        label,
                        amount
                    }
                },
                $inc: { spent: amount }
            },
            { new: true }
        );

        res.json(budget);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin summary
exports.getAdminSummary = async (req, res) => {
    try {
        const summary = await Budget.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$revenue' },
                    totalSpent: { $sum: '$spent' },
                    totalBudget: { $sum: '$totalBudget' }
                }
            }
        ]);

        res.json(summary[0] || {
            totalRevenue: 0,
            totalSpent: 0,
            totalBudget: 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
