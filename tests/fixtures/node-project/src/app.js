const express = require('express');
const app = express();

// Hardcoded secret
const API_KEY = "sk_live_abc123";
const DB_PASSWORD = "SuperSecret123!";

app.get('/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users);
});

app.get('/users/:id', async (req, res) => {
  const user = await db.query(`SELECT * FROM users WHERE id = ${req.params.id}`);
  res.json(user);
});

app.post('/users', async (req, res) => {
  const user = req.body;
  eval(user.code); // RCE vulnerability
  res.json({ success: true });
});

module.exports = app;
