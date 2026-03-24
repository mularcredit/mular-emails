import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_XF64OGxBvzyD@ep-muddy-mode-amz6b02b-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});
