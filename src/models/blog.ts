/**
 * Node Modules
 */

import { genSlug } from '@/utils'
import mongoose, { Schema, Types, model } from 'mongoose'

export type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status' >

export type IBanner = {
    publicId: string; 
    url: string; 
    width: number; 
    height: number;
}

export interface IBlog {
    title: string,
    slug: string,
    content: string,
    banner: {
        publicId: string,
        url: string
        width: number,
        height: number
    }
    author: Types.ObjectId | string,                    // | string hinzufügen für clean architecture
    viewsCount: number,
    likesCount: number
    commentsCount: number,
    status: 'draft' | 'publicated'
}


/**
 * Schema
 */

const blogSchema = new Schema<IBlog>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxlength: [180, 'Title must be less than 180 chars']
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: [true, 'Slug must be unique']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    // banner: {
    //     publicId: {
    //         type: String,
    //         required: [true, 'Banner ID is required']
    //     },
    //     url: {
    //         type: String,
    //         required: [true, 'Banner URL is required']
    //     },
    //     width: {
    //         type: Number,
    //         required: [true, 'Banner ID is required']
    //     },
    //     height: { 
    //         type: Number,
    //         required: [true, 'Banner ID is required']
    //     },
    // },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author required']
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: {
            values: ['draft', 'published'],
            message: '{VALUE is not supported}'
        },
        default: 'draft'
    }
}, {timestamps: {
    createdAt: 'publishedAt'
        }
    }
)

blogSchema.pre('validate', function(next) {
    const doc = this as IBlog;                      // TS kennt type von this nicht! oder "noImplicitThis": false
    if (doc.title && !doc.slug) {
        doc.slug = genSlug(doc.title);
    }
    next();
});


export default model<IBlog>('Blog', blogSchema)