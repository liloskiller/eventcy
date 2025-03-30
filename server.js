const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');
const app = express();
const jwt = require('jsonwebtoken');
import cors from 'cors';

// CORS configuration
const corsOptions = {
    origin: 'https://eventcy-9xoy.onrender.com', // Your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies if needed
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Handle preflight OPTIONS request separately
app.options('*', cors(corsOptions)); // This will handle OPTIONS requests for preflight checks

// Enable JSON parsing
app.use(express.json());

// Signup endpoint
app.post('/signup', async (req, res) => {
    console.log('Received signup request', req.body); // Log the incoming request
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: 'User created', userId: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) return res.status(401).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.rows[0].id }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token });
});

// Start the server
app.listen(process.env.PORT || 3000, () => console.log('Server running on port 3000'));
