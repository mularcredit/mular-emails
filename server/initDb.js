import { pool } from './db.js';
import bcrypt from 'bcryptjs';

export async function setupDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS drafts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        subject VARCHAR(255),
        html_content TEXT,
        recipients JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if admin exists
    const res = await client.query('SELECT id FROM users WHERE email = $1', ['admin@mular.io']);
    if (res.rows.length === 0) {
      const hash = await bcrypt.hash('password123', 10);
      await client.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
        ['Admin User', 'admin@mular.io', hash]
      );
      console.log('Seed: Admin user created -> admin@mular.io / password123');
    }
    
    console.log('Database connected and initialized successfully.');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}
