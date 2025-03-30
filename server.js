const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');
const app = express();
const jwt = require('jsonwebtoken');
import cors from 'cors';

app.use(cors({
    origin: 'https://eventcy-9xoy.onrender.com', 
    methods: ['GET', 'POST', 'OPTIONS'], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true, 
}));


app.use((req, res, next) => {
  res.on('finish', () => {
    console.log('Response Headers:', res.getHeaders()); 
  });
  next();
});

// Handle preflight OPTIONS requests
app.options('*', cors()); 

app.use(express.json());

// Signup endpoint
app.post('/signup', async (req, res) => {
    console.log('Received signup request', req.body); 
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
