/**
 * Node Modules
 */
import winston from 'winston'

/**
 * Custom Modules
 */

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
        colorize({ all: true }),                      // Farben aktivieren
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Zeitformat
        align(),                                      // schön ausgerichtet
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

if (config.NODE_ENV === "production") {
  transports.push(
    new winston.transports.File({
      filename: "logs/app.log",
      level: "info",
      format: combine(timestamp(), json()),
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: combine(timestamp(),errors({ stack: true }), json()), 
  transports,
  silent: config.NODE_ENV === 'test'
});

export default logger; 
