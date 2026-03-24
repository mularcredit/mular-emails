import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mular_super_secret_dev_key';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    
    const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [payload.id]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
