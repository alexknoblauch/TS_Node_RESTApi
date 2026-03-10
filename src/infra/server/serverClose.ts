import logger from '@/lib/winston';
import { Server } from 'http'

export const serverClose = function(server: Server, message: string) {
    server.close(() => {
        logger.info(message);
        process.exit(0);            
    });

    setTimeout(() => {
        logger.info('Forcefully shutting down');
        process.exit(1);
    }, 10000).unref();
}