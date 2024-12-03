import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './modules/logger/logger';

let server: any;

// Connect to MongoDB
mongoose.connect(config.mongoose.url).then(() => {
  logger.info(`Connected to MongoDB URL=> ${config.mongoose.url}`);
  
  console.log("config.port", config.port);
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

// Function to handle server exit
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(0); // Use 0 to indicate a normal exit
    });
  } else {
    process.exit(0);
  }
};

// Handle unexpected errors
const unexpectedErrorHandler = (error: string) => {
  logger.error(error);
  exitHandler();
};

// Capture uncaught exceptions
process.on('uncaughtException', unexpectedErrorHandler);

// Capture unhandled promise rejections
process.on('unhandledRejection', unexpectedErrorHandler);

// Gracefully shutdown on termination signals
process.on('SIGINT', () => {
  logger.info('SIGINT received: Shutting down gracefully...');
  exitHandler();
});

// Handle SIGTERM (e.g., from Docker or Kubernetes)
process.on('SIGTERM', () => {
  logger.info('SIGTERM received: Shutting down gracefully...');
  exitHandler();
});
