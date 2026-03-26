require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({
        message: 'EventZen API Gateway',
        status: 'running'
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        gateway: 'EventZen API Gateway',
        port: process.env.PORT,
        services: {
            users: process.env.USER_SERVICE,
            events: process.env.EVENT_SERVICE,
            bookings: process.env.BOOKING_SERVICE
        }
    });
});

// Users → Spring Boot 8080
app.use(createProxyMiddleware({
    pathFilter: '/api/users',
    target: process.env.USER_SERVICE,
    changeOrigin: true
}));

// Events → .NET 5096
app.use(createProxyMiddleware({
    pathFilter: '/api/events',
    target: process.env.EVENT_SERVICE,
    changeOrigin: true
}));

// Bookings → Node 3000
app.use(createProxyMiddleware({
    pathFilter: '/api/bookings',
    target: process.env.BOOKING_SERVICE,
    changeOrigin: true,
    
}));

// Budget → Node 3000
app.use(createProxyMiddleware({
    pathFilter: '/api/budget',
    target: process.env.BOOKING_SERVICE,
    changeOrigin: true,
    
}));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`\n🚀 API Gateway running on port ${PORT}`);
    console.log(`  /api/users    → ${process.env.USER_SERVICE}`);
    console.log(`  /api/events   → ${process.env.EVENT_SERVICE}`);
    console.log(`  /api/bookings → ${process.env.BOOKING_SERVICE}`);
    console.log(`  /api/budget   → ${process.env.BOOKING_SERVICE}\n`);
});
