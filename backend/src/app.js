const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { allowLocalDevOrigins, frontendUrls, nodeEnv } = require('./config/env');
const leadRoutes = require('./routes/leadRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1);

const localDevOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || frontendUrls.includes(origin) || (allowLocalDevOrigins && localDevOriginPattern.test(origin))) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 250,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy.' });
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Lead Management API is running.' });
});

app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.use('/api/leads', leadRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
