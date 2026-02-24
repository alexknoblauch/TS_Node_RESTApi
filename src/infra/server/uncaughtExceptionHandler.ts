import logger from "@/lib/winston";
import { Server } from 'http'
import { serverClose } from "./serverClose";

const uncaughtExceptionHandler =  (server: Server, error: Error) => {             //Error ohne handler
    logger.error('UNCAUGHT EXCEPTION! Shutting down...', {
        message: error.message,
        stack: error.stack,
        name: error.name
    });
    
    serverClose(server, 'Process terminated due to uncaught exception')     //Harter Exit
}

export default uncaughtExceptionHandler