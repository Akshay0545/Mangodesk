const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// ✅ ALWAYS load the .env next to this file, regardless of where you start node
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const summaryRoutes = require('./routes/summaryRoutes');

const app = express();

// --- TEMP sanity logs (remove after verifying) ---
console.log('Groq key loaded?', !!process.env.GROQ_API_KEY);
console.log('Mongo URI set?', !!(process.env.MONGODB_URI || process.env.MONGO_URI));
console.log('Email user present?', !!(process.env.EMAIL_USER || process.env.SMTP_USER));
console.log('Email pass present?', !!(process.env.EMAIL_PASS || process.env.SMTP_PASS));
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

// DB
connectDB();

// Middleware
const allowOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// app.use(cors({
//   origin: allowOrigins.includes('*') ? true : allowOrigins,
//   credentials: true
// }));
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Static (if you ever store files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/summary', summaryRoutes);

// Health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'MangoDesk API is running' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Something went wrong!' });
});

// 404
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
