// routes/test.ts
import { Router } from 'express';
import logger from '@/lib/winston';
import { testService } from './testService';

declare module 'express-serve-static-core' {
  interface Request {
    correlationId?: string;
  }
}

const router = Router();

router.get('/test-correlation', (req, res) => {
  // 1. Direkt loggen (sollte correlationId haben)
  logger.info('Test correlation ID route called');
  
  // 2. In Service schicken
  testService.doSomething();
  
  // 3. Response mit Infos
  res.json({
    message: 'Check your logs!',
    headers: {
      'x-correlation-id': req.headers['x-correlation-id']
    },
    correlationId: req.correlationId
  });
})

export default router;