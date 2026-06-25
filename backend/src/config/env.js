require('dotenv').config();

/**
 * Centralized environment configuration.
 * Throws early and loudly if a required variable is missing,
 * instead of failing mysteriously deep inside a service.
 */
const required = ['MONGODB_URI', 'GEMINI_API_KEY', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'TRACKING_SECRET'];

const missing = required.filter((key) => !process.env[key] || process.env[key].startsWith('your_'));
if (missing.length > 0 && process.env.NODE_ENV !== 'test') {
  console.warn(
    `⚠️  Warning: the following env vars are missing or still using placeholder values: ${missing.join(', ')}\n` +
      `   The server will start, but related features (DB / Gemini / Email) will fail until configured.\n` +
      `   Copy backend/.env.example to backend/.env and fill in real values.`
  );
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  frontendUrls: (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
  allowLocalDevOrigins: process.env.ALLOW_LOCAL_DEV_ORIGINS !== 'false',
  allowVercelOrigins: process.env.ALLOW_VERCEL_ORIGINS !== 'false',
  mongoUri: process.env.MONGODB_URI,
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromName: process.env.EMAIL_FROM_NAME || 'Lead Management System',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER,
  },
  trackingSecret: process.env.TRACKING_SECRET || 'dev-secret-change-me',
};
