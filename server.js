const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Request logging middleware (add this first)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// Enhanced CORS configuration
const corsOptions = {
  origin: 'https://eventcy-9xoy.onrender.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'], // Expose Authorization header to frontend
  credentials: true,
  maxAge: 86400, // Cache preflight for 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests globally
app.options('*', cors(corsOptions));

app.use(express.json());

// Signup endpoint with enhanced CORS headers
app.post('/signup', async (req, res) => {
    console.log('Received signup request body:', req.body);
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400)
                  .header('Access-Control-Allow-Origin', corsOptions.origin)
                  .json({ error: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hashedPassword]
        );
        
        res.status(201)
           .header('Access-Control-Allow-Origin', corsOptions.origin)
           .header('Access-Control-Expose-Headers', 'Authorization')
           .json({ 
             message: 'User created', 
             userId: result.rows[0].id 
           });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500)
           .header('Access-Control-Allow-Origin', corsOptions.origin)
           .json({ 
             error: err.message,
             details: process.env.NODE_ENV === 'development' ? err.stack : undefined
           });
    }
});

// Login endpoint with enhanced CORS headers
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400)
                  .header('Access-Control-Allow-Origin', corsOptions.origin)
                  .json({ error: 'Email and password are required' });
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401)
                      .header('Access-Control-Allow-Origin', corsOptions.origin)
                      .json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401)
                      .header('Access-Control-Allow-Origin', corsOptions.origin)
                      .json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.rows[0].id }, 'your_secret_key', { expiresIn: '1h' });
        
        res.header('Access-Control-Allow-Origin', corsOptions.origin)
           .header('Access-Control-Expose-Headers', 'Authorization')
           .json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500)
           .header('Access-Control-Allow-Origin', corsOptions.origin)
           .json({ 
             error: err.message,
             details: process.env.NODE_ENV === 'development' ? err.stack : undefined
           });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500)
       .header('Access-Control-Allow-Origin', corsOptions.origin)
       .json({ 
         error: 'Something went wrong!',
         details: process.env.NODE_ENV === 'development' ? err.stack : undefined
       });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200)
       .header('Access-Control-Allow-Origin', corsOptions.origin)
       .json({ status: 'ok' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS configured for origin: ${corsOptions.origin}`);
});
