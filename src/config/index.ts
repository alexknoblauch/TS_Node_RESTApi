/**
 *  Node modules
 */
import getOrSetRedis from "@/utils/getOrSetRedis";
import dotenv from "dotenv";
dotenv.config();

/**
 *  Types
 */
import type ms from 'ms'


const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV as string,
    MONGOOSE_URI: process.env.MONGOOSE_URI,
    WHITELIST_ORIGINS: [
    "http://localhost:3000", 
  ],
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    ACCESS_TOKEN_EXPIRY: (process.env.ACCESS_TOKEN_EXPIRY || '15m') as ms.StringValue,
    REFRESH_TOKEN_EXPIRY: (process.env.REFRESH_TOKEN_EXPIRY || '7d') as ms.StringValue,


    WHITELIST_ADMINS_EMAIL: [
      'alex5@gmail.com',
      'angel@gmail.com'
    ],
    defaultResLimit: 20,
    defaultOffset: 0,


    CLOUDENARY_CLOUD_NAME: process.env.CLOUDENARY_CLOUD_NAME!,
    CLOUDENARY_API_KEY: process.env.CLOUDENARY_API_KEY!,
    CLOUDENARY_CLOUD_SECRET: process.env.CLOUDENARY_CLOUD_SECRET!
}

export default config