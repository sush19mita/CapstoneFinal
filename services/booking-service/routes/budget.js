const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Get budget for vendor
router.get('/vendor/:vendorId', async (req, res) => {
    try {
        const budgets = await Budget.find({
            vendorId: req.params.vendorId
        });
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create or update budget for event
router.post('/', async (req, res) => {
    try {
        const { vendorId, eventId, totalBudget } = req.body;

        // ✅ validation
        if (!vendorId || !eventId || !totalBudget) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const budget = await Budget.findOneAndUpdate(
            { vendorId, eventId },
            req.body,
            { upsert: true, new: true }
        );

        res.json(budget);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add expense to budget
router.post('/:id/expense', async (req, res) => {
    try {
        const { label, amount } = req.body;

        // ✅ validation
        if (!label || !amount) {
            return res.status(400).json({ error: "Label and amount required" });
        }

        const budget = await Budget.findByIdAndUpdate(
            req.params.id,
            {
                $push: { expenses: { label, amount } },
                $inc: { spent: amount }
            },
            { new: true }
        );

        res.json(budget);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin summary
router.get('/admin/summary', async (req, res) => {
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
});

module.exports = router;
