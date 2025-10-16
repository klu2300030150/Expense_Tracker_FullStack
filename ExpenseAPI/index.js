import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();

app.use(express.json());
app.use(cors({
  origin: (origin, cb) => cb(null, true),
}));

app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
