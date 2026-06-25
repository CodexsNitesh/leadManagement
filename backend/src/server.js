require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/env');
const { verifyEmailConnection } = require('./services/emailService');

const startServer = () => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  connectDB()
    .then(() => verifyEmailConnection())
    .catch((error) => {
      console.error('Startup dependency check failed:', error.message);
      console.error('Server remains online for platform health checks. Fix environment variables or network access.');
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
