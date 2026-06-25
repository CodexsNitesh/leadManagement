require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/env');
const { verifyEmailConnection } = require('./services/emailService');

const startServer = async () => {
  await connectDB();
  await verifyEmailConnection();

  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received. Shutting down gracefully.`);
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
  });
};

startServer();
