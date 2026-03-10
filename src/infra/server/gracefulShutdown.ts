import { disconnectDatabase } from "@/lib/mongoose";
import { redisClient } from "@/lib/redis";
import logger from "@/lib/winston";
import { Server } from 'http'

const gracefulShutdown = (server: Server) => () => {     // HOF weil process.on cb erwartet und cb kein argument haben kann
    try {
        server.close(async () => {
            try {
                await disconnectDatabase();
                await redisClient.quit()
                logger.info('dissconnected from DB')
            } catch (err) {
                logger.error('Error disconnecting from DB')
            } finally {
                logger.info('Server shut down');
                process.exit(0);
            }
        });

        setTimeout(() => {
            logger.info('Forcefully shutdown')
            process.exit(1)
        }, 10000)

    } catch (err) {
        logger.error('Error during server shutdown');
        process.exit(1);
    }
}

export default gracefulShutdown