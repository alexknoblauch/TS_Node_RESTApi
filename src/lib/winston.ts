/**
 * Node Modules
 */
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

/**
 * Node Modules
 */
import config from '../config'

const { combine, timestamp, json, errors, align, printf, colorize } = winston.format;

const transports: winston.transport[] = [];

if (config.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),                                    // Farben aktivieren
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),               // Zeitformat
        align(),                                                    // schön ausgerichtet
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr =
            Object.keys(meta).length > 0
              ? "\n" + JSON.stringify(meta, null, 2)
              : "";
          return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
        })
      ),
    })
  );
}


//LOG ROTATION in production mit DailyRotatFile: npm install winston-daily-rotate-file
if (config.NODE_ENV === "production") {
  transports.push(
    new DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
      format: combine(timestamp(), json())
    })
  );

  transports.push(
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',       // error
      maxSize: '10m',
      maxFiles: '30d',      
      zippedArchive: true,
      format: combine(timestamp(), json()) 
    })
  )

    transports.push(
      new DailyRotateFile({
        filename: 'logs/warn-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'warn',        // Nur warn und error
        maxSize: '10m',
        maxFiles: '30d',
        format: combine(timestamp(), json()) 
      })
    )
}

const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',                           //Fallback hier wichtig
  format: combine(timestamp(),errors({ stack: true }), json()), 
  transports,
  silent: config.NODE_ENV === 'test'
});

export default logger; 
