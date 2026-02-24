import { serverClose } from "./serverClose";
import { Server } from 'http'


const unhandledRejectionHandler = (server: Server: any, promise: Promise<any>) => {
    logger.error('UNHANDLED REJECTION! Shutting down...', {     //Rejected Promise = inkonsisenz
        reason: reason?.message || reason,
        stack: reason?.stack,
        promise
    });
    
    serverClose(server, 'Process terminated due to unhandled rejection')    //Harter Exit
}