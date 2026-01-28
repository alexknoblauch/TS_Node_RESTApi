import logger from '@/lib/winston';
import { Server } from 'http'

export const serverClose = function(server: Server, message: string) {
    server.close(() => {
        logger.error(message);
        process.exit(1);
    });
}