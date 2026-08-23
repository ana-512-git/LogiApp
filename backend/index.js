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

// TICKETS QUERIES
app.get('/api/tickets', async (req, res) => {
  try {
    const queryText = `
      SELECT 
        t.id,
        t.text,
        t.timestamp,
        t.creator_id,
        u.first_name AS creator_first_name,
        u.last_name AS creator_last_name,
        t.object_id,
        o.name AS object_name
      FROM tickets t
      JOIN users u ON t.creator_id = u.id
      JOIN objects o ON t.object_id = o.id
      ORDER BY t.timestamp DESC;
    `;

    const result = await query(queryText);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    return res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

app.post('/api/tickets/create', async (req, res) => {
  const { object_id, text, user_id } = req.body;
  const creator_id = user_id;

  if (!object_id || !text) {
    return res.status(400).json({ error: 'Object ID and ticket text are required' });
  }

  try {
    const insertQuery = `
      INSERT INTO tickets (creator_id, object_id, text)
      VALUES ($1, $2, $3)
      RETURNING id, creator_id, object_id, text, timestamp;
    `;
    const result = await query(insertQuery, [creator_id, object_id, text]);

    return res.status(201).json({
      message: 'Ticket created successfully',
      ticket: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating ticket:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
})

app.delete('/api/tickets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query ('DELETE FROM tickets WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'object doesnt exist'});
    }

    return res.status(200).json({ message: 'Object deleted successfully'});
  } catch (err) {
    console.log("sth went wrong at delete: ", err);
    return res.status(500).json({ error: 'A db error occured'});
  }
});

// ITEMS QUERIES

app.get('/api/objects', async (req, res) => {
  try {
    const queryText = `
      SELECT 
        o.id,
        o.name,
        o.observations,
        o.source_url,
        o.category,
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'location', s.location,
              'quantity', s.quantity,
              'quantity_measurement', s.quantity_measurement,
              'is_quantity_aproximation', s.is_quantity_aproximation
            )
          ) FILTER (WHERE s.id IS NOT NULL), '[]'
        ) AS stocks
      FROM objects o
      LEFT JOIN object_stock s ON o.id = s.object_id
      GROUP BY o.id
      ORDER BY o.id ASC;
    `;
    const result = await query(queryText);
    res.json(result.rows);
  } catch(err) {
    console.log("Error fetching all objects: ", err);
    res.status(500).json({ error: 'Failed to fetch objects' });
  }
})

app.post('/api/objects/create', async (req, res) => {
  try {
    // 1. Default stocks to [] to prevent crash if undefined
    const { name, observations, source_url, category, stocks = [] } = req.body;

    const result = await query(
      'INSERT INTO objects (name, observations, source_url, category) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, observations || null, source_url || null, category]
    );

    const objId = result.rows[0].id;
    console.log('created object ID:', objId);

    // 2. Loop through stocks with fixed SQL parenthesis and property fallbacks
    for (const stk of stocks) {
      try {
        const crt_res = await query(
          'INSERT INTO object_stock (object_id, location, quantity, quantity_measurement, is_quantity_aproximation) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [
            objId,
            stk.location,
            stk.quantity,
            stk.quantity_measurement || stk.q_measurement || null,
            stk.is_quantity_aproximation ?? stk.is_approx ?? false
          ]
        );

        console.log("added stock entry:", crt_res.rows[0]);
      } catch (err) {
        console.error("Error adding stock entry:", err);
        return res.status(500).json({ error: "Something went wrong adding stock entries" });
      }
    }

    return res.status(201).json({
      message: "Object created successfully",
      objId: objId
    });

  } catch (err) {
    console.error('Database Error:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
});

app.delete('/api/objects/:id', async (req, res) => {
  const { id }= req.params;

  try {
    await query ('DELETE FROM object_stock WHERE object_id = $1', [id]);
    const result = await query ('DELETE FROM objects WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Object not found' });
    }

    return res.status(200).json({ message: 'Object deleted successfully', id});
  } catch (err) {
    console.log("sth went wrong at delete: ", err);
    return res.status(500).json({ error: 'Db query failed'});
  }
})

app.put('/api/objects/:id', async (req, res) => {
  const { id } = req.params;
  const { observations, stocks } = req.body;

  if (!stocks || !Array.isArray(stocks) || stocks.length === 0) {
    return res.status(400).json({ error: 'Object stock cannot be null or empty' });
  }

  try {
    const objres = await query(
      'UPDATE objects SET observations = $1 WHERE id = $2 RETURNING id, name, observations, category;',
      [observations || null, id]
    );

    if (objres.rows.length === 0) {
      return res.status(404).json({ error: 'Object not found.' });
    }

    await query('DELETE FROM object_stock WHERE object_id = $1', [id]);

    const insertStockQuery = `
      INSERT INTO object_stock (object_id, location, quantity, quantity_measurement, is_quantity_aproximation)
      VALUES ($1, $2, $3, $4, $5);
    `;

    for (const stk of stocks) {
      await query(insertStockQuery, [
        id,
        stk.location,
        stk.quantity,
        stk.quantity_measurement || stk.q_measurement || null,
        stk.is_quantity_aproximation ?? stk.is_approx ?? false
      ]);
    }

    return res.status(200).json({
      message: 'Object updated successfully',
      updatedObject: objres.rows[0]
    });
  } catch (err) {
    console.error('Error updating object and stock:', err);
    return res.status(500).json({ error: 'Database update failed.' });
  }
});
// AUTHENTICATION

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
      { userId: user.id, first_name: user.first_name, email: user.email, role: user.role || 'staff' },
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