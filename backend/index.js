require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// TODO: delete this, it's just for checking that it works
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT count(*) FROM users');
    res.json({
      status: 'ok',
      message: 'Backend & Database successfully connected! Restart too',
      userCount: result.rows[0].count,
    });
  } catch (err) {
    console.error('Health Check Error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});