const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');

// 1. Security headers and request logging
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// 2. Enhanced CORS configuration
const allowedOrigins = [
  'https://eventcy-9xoy.onrender.com',
  // Add other allowed origins if needed
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// 3. Apply CORS middleware
app.use(cors(corsOptions));

// 4. Explicit OPTIONS handler for proxy compatibility
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
  res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  res.status(204).send();
});

app.use(express.json());

// 5. Enhanced signup endpoint
app.post('/signup', async (req, res) => {
    console.log('Received signup request body:', req.body);
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400)
                  .header('Access-Control-Allow-Origin', req.headers.origin)
                  .json({ error: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hashedPassword]
        );
        
        res.status(201)
           .header('Access-Control-Allow-Origin', req.headers.origin)
           .header('Access-Control-Expose-Headers', 'Authorization')
           .json({ 
             message: 'User created', 
             userId: result.rows[0].id 
           });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500)
           .header('Access-Control-Allow-Origin', req.headers.origin)
           .json({ 
             error: err.message,
             details: process.env.NODE_ENV === 'development' ? err.stack : undefined
           });
    }
});

// 6. Enhanced login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400)
                  .header('Access-Control-Allow-Origin', req.headers.origin)
                  .json({ error: 'Email and password are required' });
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401)
                      .header('Access-Control-Allow-Origin', req.headers.origin)
                      .json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401)
                      .header('Access-Control-Allow-Origin', req.headers.origin)
                      .json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.rows[0].id }, 'your_secret_key', { expiresIn: '1h' });
        
        res.header('Access-Control-Allow-Origin', req.headers.origin)
           .header('Access-Control-Expose-Headers', 'Authorization')
           .json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500)
           .header('Access-Control-Allow-Origin', req.headers.origin)
           .json({ 
             error: err.message,
             details: process.env.NODE_ENV === 'development' ? err.stack : undefined
           });
    }
});

// 7. Health check endpoint
app.get('/health', (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.status(200).json({ 
    status: 'ok',
    cors: {
      allowedOrigins: allowedOrigins,
      currentOrigin: origin,
      allowed: allowedOrigins.includes(origin)
    }
  });
});

// 8. Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const response = { error: err.message || 'Something went wrong!' };
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.status(err.status || 500).json(response);
});

// 9. Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
  console.log('Health check endpoint: /health');
});
