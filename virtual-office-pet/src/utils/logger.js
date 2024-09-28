import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  format: format.combine(
    format.colorize(),
    format.simple()
  ),
  transports: [
    new transports.Console()
  ],
});

export default logger;
