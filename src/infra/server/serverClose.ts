import logger from '@/lib/winston';
import { Server } from 'http'

export const serverClose = function(server: Server, message: string) {
    server.close(() => {
        logger.error(message);
        process.exit(1);            
    });

    setTimeout(() => {
        logger.error('Forcefully shutting down');
        process.exit(1);
    }, 10000).unref();
}