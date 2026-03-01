
/**
 * Node Modules
 */
import { createClient } from 'redis';       // muss dieser import sein!! nur redis
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


export async function initRedis() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch(err){
    throw new InfrastructureError('RedisClient not initialized', 'Redis', err)
  }
}