import { Router } from 'express';
import { pool } from '../db.js';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mular_super_secret_dev_key';

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drafts WHERE user_id = $1 ORDER BY updated_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { subject, html_content, recipients } = req.body;
    const result = await pool.query(
      'INSERT INTO drafts (user_id, subject, html_content, recipients) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, subject, html_content, JSON.stringify(recipients || {})]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { subject, html_content, recipients } = req.body;
    const result = await pool.query(
      'UPDATE drafts SET subject = $1, html_content = $2, recipients = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND user_id = $5 RETURNING *',
      [subject, html_content, JSON.stringify(recipients || {}), req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Draft not found' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM drafts WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
