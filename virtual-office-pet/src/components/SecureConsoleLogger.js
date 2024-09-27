import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ],
});

export const logInfo = (message) => {
  logger.info(message);
};

export const logError = (message) => {
  logger.error(message);
};

export const logWarning = (message) => {
  logger.warn(message);
};

export default logger;
