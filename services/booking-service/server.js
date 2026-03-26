require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/budget', require('./routes/budget'));

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        service: 'booking-service',
        port: process.env.PORT
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Booking service running on port ${PORT}`);
});
