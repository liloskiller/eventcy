require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`,
  credentials: true
}));

app.use(express.static(path.join(__dirname, '../.next/static')));
app.use(express.static(path.join(__dirname, '../public')));


app.get('/api', (req, res) => {
  res.json({
    status: 'API is working!',
    endpoints: {
      signup: 'POST /api/signup',
      login: 'POST /api/login',
      test_db: 'GET /api/test-db'
    }
  });
});


// Auth endpoints
app.post('api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

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
    
    res.status(201).json({ 
      status: 'success',
      user: result.rows[0], 
      token 
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(400).json({ 
      status: 'error',
      error: err.message 
    });
  }
});

app.post('api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

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
      status: 'success',
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email
      },
      token 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ 
      status: 'error',
      error: err.message 
    });
  }
});

app.get('api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'success',
      message: 'Database connection successful!',
      time: result.rows[0].now 
    });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({ 
      status: 'error',
      error: 'Database connection failed',
      details: err.message 
    });
  }
});

// 404 handler - ADDED THIS
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: 'Endpoint not found',
    available_endpoints: {
      root: 'GET /',
      signup: 'POST /signup',
      login: 'POST /login',
      test_db: 'GET /test-db'
    }
  });
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Try these endpoints:`);
  console.log(`- GET /`);
  console.log(`- POST /signup`);
  console.log(`- POST /login`);
  console.log(`- GET /test-db`);
});