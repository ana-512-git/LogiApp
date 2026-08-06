import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Invalid token, pls log in' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = decoded;
    next();
  });
};

app.post('/api/auth/login', async(req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await query(
      'SELECT id, first_name, last_name, email, password_hash, role FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password!' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password!'})
    }

    const secretKey = process.env.JWT_SECRET || 'super_secret_temporary_key';
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role || 'staff' },
      secretKey,
      { expiresIn: '24h' }
    );

    return res.status(200).json({ message: 'Successfull login!', token, user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
    })
    } catch (err) {
      console.error('Login Database Error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
});

const ALLOWED_DOMAINS = ['gmail.com', 'yahoo.com', 'stud.acs.upb.ro'];

const isValidEmail = (email) => {
  if (!email.includes('@')) return false;

  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2) return false;
  
  const [username, domain] = parts;
  return username.length > 0 && ALLOWED_DOMAINS.includes(domain);
};

app.post('/api/auth/register', async(req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email format invalid! Accepted emails: user@gmail.com, user@stud.acs.upb.ro, user@yahoo.com'})
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must have at least 6 characters!'});
  }

  const saltRounds = 10;
  const hashedPass = await bcrypt.hash(password, saltRounds);

  try {
    const result = await query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, role`,
      [firstName, lastName, email.trim().toLowerCase(), hashedPass, 'staff']
    );

    const user = result.rows[0];
    console.log('User created:', user);

    const secretKey = process.env.JWT_SECRET || 'super_secret_temporary_key';
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role || 'staff' },
      secretKey,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: user,
    });
  } catch (err) {
    // 23505 = duplicate key error in Postgres
    if (err.code === '23505') {
      return res.status(409).json({ error: 'An account with that email already exists!' });
    }
    console.error('Database Error:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
})

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});