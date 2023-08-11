import winston from 'winston';
import path from 'path';

const logsDirectory = path.join(__dirname, '../logs');

class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
          return `${info.timestamp} [${info.level.toUpperCase()}] - ${
            info.message
          }`;
        })
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: path.join(logsDirectory, 'error.log'),
          level: 'error',
        }),
        new winston.transports.File({
          filename: path.join(logsDirectory, 'combined.log'),
        }),
      ],
    });
  }

  info(message: string): void {
    this.logger.info(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }
}

export default new Logger();
