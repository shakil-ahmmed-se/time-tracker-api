"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
const logger_1 = __importDefault(require("./modules/logger/logger"));
let server;
// Connect to MongoDB
mongoose_1.default.connect(config_1.default.mongoose.url).then(() => {
    logger_1.default.info(`Connected to MongoDB URL=> ${config_1.default.mongoose.url}`);
    console.log("config.port", config_1.default.port);
    server = app_1.default.listen(config_1.default.port, () => {
        logger_1.default.info(`Listening to port ${config_1.default.port}`);
    });
});
// Function to handle server exit
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger_1.default.info('Server closed');
            process.exit(0); // Use 0 to indicate a normal exit
        });
    }
    else {
        process.exit(0);
    }
};
// Handle unexpected errors
const unexpectedErrorHandler = (error) => {
    logger_1.default.error(error);
    exitHandler();
};
// Capture uncaught exceptions
process.on('uncaughtException', unexpectedErrorHandler);
// Capture unhandled promise rejections
process.on('unhandledRejection', unexpectedErrorHandler);
// Gracefully shutdown on termination signals
process.on('SIGINT', () => {
    logger_1.default.info('SIGINT received: Shutting down gracefully...');
    exitHandler();
});
// Handle SIGTERM (e.g., from Docker or Kubernetes)
process.on('SIGTERM', () => {
    logger_1.default.info('SIGTERM received: Shutting down gracefully...');
    exitHandler();
});
//# sourceMappingURL=index.js.map