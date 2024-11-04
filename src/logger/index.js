import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          level: 'info',
          dirname: 'logs',
          filename: 'point-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '10M'
      })
    ]
});

export default logger;