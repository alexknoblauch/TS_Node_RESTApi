/**
 * Node Modules
 */
import { createClient } from 'redis';       // muss dieser import sein!! nur redis
import logger from './winston';

/**
 * Types
 */

export const redisClient = createClient({
  url: 'redis://localhost:6379'           //Docker redis://redis:6379    AWS redis://default:abc123@redis-12345.us-east-1.cloud.redislabs.com:12345
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
    throw new InfrastructureError('RedisClient not initialized', 'Redis', {err})
  }
}