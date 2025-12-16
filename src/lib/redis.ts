
/**
 * Node Modules
 */
import { createClient } from 'redis';
import logger from './winston';

/**
 * Types
 */

const redisClient = createClient({
  url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

export { redisClient };