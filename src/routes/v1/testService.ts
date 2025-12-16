// services/testCorrelationService.ts
import logger from '@/lib/winston';

export const testService = {
  doSomething: () => {
    logger.info('Service layer called');
    
    // Simuliere async Operation
    return new Promise((resolve) => {
      setTimeout(() => {
        logger.info('Service async operation completed');
        resolve('done');
      }, 50);
    });
  }
};