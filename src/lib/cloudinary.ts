/**
 * Node Modules
 */

import { v2 as cloudinary } from 'cloudinary'

/**
 * Custom Modules
 */

import config from 'config'
import logger from './winston'


/**
 * Types
 */

import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'


cloudinary.config({
    cloud_name: config.CLOUDENARY_CLOUD_NAME,
    api_key: config.CLOUDENARY_API_KEY,
    api_secret: config.CLOUDENARY_CLOUD_SECRET,
    secure: config.NODE_ENV === 'production'
})


const uploadToCloudinary = (buffer: Buffer<ArrayBufferLike>, publicId?: string): Promise<UploadApiResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            allowed_formats: ['png', 'jpg', 'webp'], 
            resource_type: 'image', 
            folder: 'blog-api', 
            public_id: publicId, 
            transformation: { quality: 'auto' },
        }, (err, result) => {
            if (err) {
                logger.error('Error uploading image to Cloudinary', err);
                reject(err);
            }
            resolve(result);
        }).end(buffer);
    });
};

export default uploadToCloudinary