require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// CORS middleware - adjust origin for your Vercel frontend
app.use(cors({
  origin: 'https://your-vercel-app.vercel.app',
  credentials: true
}));

app.use(express.json());

// Auth endpoints
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    
    const token = jwt.sign(
      { userId: result.rows[0].id }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ user: result.rows[0], token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ 
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email
      },
      token 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));