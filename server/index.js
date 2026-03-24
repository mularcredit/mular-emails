import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupDb } from './initDb.js';
import authRoutes from './routes/auth.js';
import brevoRoutes from './routes/brevo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/brevo', brevoRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

setupDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Express API Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database', err);
});
