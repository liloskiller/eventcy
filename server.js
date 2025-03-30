const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');

// 1. NEW: Security headers and Render proxy handling (AT THE VERY TOP)
app.use((req, res, next) => {
  // Remove Express header
  res.removeHeader('X-Powered-By');
  
  // Bypass Render's default OPTIONS handling
  if (req.method === 'OPTIONS' && req.headers['x-render-origin-server']) {
    return next(); // Let our CORS middleware handle it
  }
  
  // Request logging
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// 2. NEW: Enhanced CORS configuration with environment variables
const allowedOrigins = process.env.RENDER_ALLOWED_ORIGINS 
  ? process.env.RENDER_ALLOWED_ORIGINS.split(',') 
  : ['https://eventcy-9xoy.onrender.com'];

const allowedMethods = process.env.RENDER_ALLOWED_METHODS 
  ? process.env.RENDER_ALLOWED_METHODS.split(',') 
  : ['GET', 'POST', 'OPTIONS'];

// Custom CORS middleware to handle Render proxy
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', allowedMethods.join(','));
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Keep the cors package for additional safety
app.use(cors({
  origin: allowedOrigins,
  methods: allowedMethods,
  credentials: true
}));

app.use(express.json());

// Updated endpoints (using dynamic origin from headers)
app.post('/signup', async (req, res) => {
    console.log('Received signup request body:', req.body);
    const { username, email, password } = req.body;
    const origin = req.headers.origin;
    
    if (!username || !email || !password) {
        return res.status(400)
                  .header('Access-Control-Allow-Origin', origin)
                  .json({ error: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hashedPassword]
        );
        
        res.status(201)
           .header('Access-Control-Allow-Origin', origin)
           .header('Access-Control-Expose-Headers', 'Authorization')
           .json({ 
             message: 'User created', 
             userId: result.rows[0].id 
           });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500)
           .header('Access-Control-Allow-Origin', origin)
           .json({ 
             error: err.message,
             details: process.env.NODE_ENV === 'development' ? err.stack : undefined
           });
    }
});

// Updated login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const origin = req.headers.origin;
    
    if (!email || !password) {
        return res.status(400)
                  .header('Access-Control-Allow-Origin', origin)
                  .json({ error: 'Email and password are required' });
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401)
                      .header('Access-Control-Allow-Origin', origin)
                      .json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401)
                      .header('Access-Control-Allow-Origin', origin)
                      .json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.rows[0].id }, 'your_secret_key', { expiresIn: '1h' });
        
        res.header('Access-Control-Allow-Origin', origin)
           .header('Access-Control-Expose-Headers', 'Authorization')
           .json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500)
           .header('Access-Control-Allow-Origin', origin)
           .json({ 
             error: err.message,
             details: process.env.NODE_ENV === 'development' ? err.stack : undefined
           });
    }
});

// Updated health check endpoint
app.get('/health', (req, res) => {
    const origin = req.headers.origin;
    res.status(200)
       .header('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : '')
       .json({ 
         status: 'ok',
         cors: {
           allowedOrigins: allowedOrigins,
           currentOrigin: origin,
           allowed: allowedOrigins.includes(origin)
         }
       });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const origin = req.headers.origin;
    res.status(500)
       .header('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : '')
       .json({ 
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
