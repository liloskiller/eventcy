const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');

// 1. NEW: Primary CORS handler (MUST BE FIRST MIDDLEWARE)
app.use((req, res, next) => {
  // Remove Express header
  res.removeHeader('X-Powered-By');
  
  // Handle OPTIONS requests immediately (bypasses Render's proxy)
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', 'https://eventcy-9xoy.onrender.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }
  
  // Request logging
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// 2. Environment configuration
const allowedOrigins = process.env.RENDER_ALLOWED_ORIGINS 
  ? process.env.RENDER_ALLOWED_ORIGINS.split(',') 
  : ['https://eventcy-9xoy.onrender.com'];

const allowedMethods = process.env.RENDER_ALLOWED_METHODS 
  ? process.env.RENDER_ALLOWED_METHODS.split(',') 
  : ['GET', 'POST', 'OPTIONS'];

// 3. Secondary CORS protection for non-OPTIONS requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

// 4. Body parser and cors package (for additional safety)
app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  methods: allowedMethods,
  credentials: true
}));

// Signup endpoint
app.post('/signup', async (req, res) => {
    console.log('Received signup request body:', req.body);
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hashedPassword]
        );
        
        res.status(201).json({ 
            message: 'User created', 
            userId: result.rows[0].id 
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ 
            error: err.message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.rows[0].id }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            error: err.message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        cors: {
            allowedOrigins: allowedOrigins,
            currentOrigin: req.headers.origin,
            allowed: allowedOrigins.includes(req.headers.origin)
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
    console.log(`Allowed methods: ${allowedMethods.join(', ')}`);
});
