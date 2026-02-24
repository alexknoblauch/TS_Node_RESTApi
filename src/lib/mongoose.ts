import mongoose from 'mongoose'
/**
 *  Cluster Modules
*/

/**
 *  Custom Modules
*/
import logger from '@/lib/winston'


/**
 *  Types
*/
import { ConnectOptions } from 'mongoose'

/**
 *  Client Options
*/
const clientOptiones: ConnectOptions = {
    dbName: 'tutorial-6h',
    appName: 'tutorial',
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    }
}

export const connectToDatabase = async function():Promise<void>{
    try{
        if(!process.env.MONGOOSE_URI) return
        await mongoose.connect(process.env.MONGOOSE_URI, clientOptiones)
        
        logger.info('connections successful', {
            uri: process.env.MONGOOSE_URI,
            options: clientOptiones
        })
    } catch(err){
        logger.error("Connection to DB failed:", err);
    }
}


export const disconnectDatabase = async function(): Promise<void>{
    try{
        await mongoose.disconnect();

        logger.info('successfully disconnected form Database' , {
            uri: process.env.MONGOOSE_URI,
            clientoptions: clientOptiones 
        });
    } catch (err){
        if(err instanceof Error)
        console.error("Disonnection to DB failed:", err);
    }
}