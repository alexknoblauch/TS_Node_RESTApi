import { disconnectDatabase } from "@/lib/mongoose";
import logger from "@/lib/winston";
import { Server } from 'http'

const handleShutDown = (server: Server) => () => {     // HOF weil process.on cb erwartet und cb kein argument haben kann
    try {
        server.close(async () => {
            await disconnectDatabase();
            logger.info('Server shut down');
            process.exit(0);
        });
    } catch (err) {
        logger.error('Error during server shutdown');
        process.exit(1);
    }
}

export default handleShutDown