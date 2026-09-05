const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');
const dns = require('dns');

// Fallback to Google & Cloudflare DNS to avoid querySrv ENOTFOUND and getaddrinfo ENOTFOUND
// when local ISP or router DNS fails to resolve .mongodb.net records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

  const origLookup = dns.lookup;
  dns.lookup = function (hostname, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    dns.resolve4(hostname, (err, addresses) => {
      if (!err && addresses && addresses.length > 0) {
        if (options && options.all) {
          return callback(null, addresses.map((addr) => ({ address: addr, family: 4 })));
        }
        return callback(null, addresses[0], 4);
      }
      return origLookup(hostname, options, callback);
    });
  };
} catch (e) {
  // Silent fallback if environment disallows setting custom DNS
}

dotenv.config();
const app = express();

// Secure CORS Configuration
const allowedOrigins = [
  'https://sunrisegadgetsstore.com',
  'https://www.sunrisegadgetsstore.com',
  'https://euphonious-mousse-b95cd0.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

if (process.env.FRONTEND_URL) {
  const customOrigin = process.env.FRONTEND_URL.replace(/\/+$/, '');
  if (!allowedOrigins.includes(customOrigin)) {
    allowedOrigins.push(customOrigin);
  }
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS access denied: origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Global API Rate Limiter (300 requests per 15 minutes per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✓ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection failed:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Health check endpoints
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the Sunrise Gadgets API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/contact', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ API Base URL: http://localhost:${PORT}`);
});