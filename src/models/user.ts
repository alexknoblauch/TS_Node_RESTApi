/**
 *  Node Modules
 */
import mongoose, {Schema, model} from 'mongoose'

/**
 *  Custom Modules
 */
import bcrypt from 'bcrypt'
import { Types } from 'mongoose';

export interface IUser {
    _id: Types.ObjectId | string;  
    userName: string
    email: string,
    password: string,
    role: 'admin' | 'user'
    firstName?: string,
    lastName?: string,
    socialLinks?: {
        website?: string,
        youtube?: string
        facebook?: string,
        linkedin?: string,
        x?: string,
        instagram?: string
    },
    twoFactorSecret: string,
    twoFactorEnabled: boolean,
    refreshToken: string
};

export interface SafeUser {
    _id: Types.ObjectId | string;
    userName: string;
    email: string;
    role: 'admin' | 'user';
    firstName?: string;
    lastName?: string;
    socialLinks?: {
        website?: string;
        youtube?: string;
        facebook?: string;
        linkedin?: string;
        x?: string;
        instagram?: string;
    };
}

const UserSchema = new Schema<IUser>({
    userName: {
        type: String,
        required: [true, 'Username ist required'],
        unique: [true, 'Username must be unique'],
        maxLength: [20, 'Username must have less than 20 chars']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
        maxlength: [50, 'Email must be shortar than 50 chars']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: {
            values: ['admin', 'user'],
            message: '{VALUE} is not supported'
        },
        default: 'user'
    },
    firstName: {
        type: String,
        maxLength: [20, 'Firstname must be less than 20 chars']
    },
    lastName: {
        type: String,
        maxLength: [20, 'Lastname must be less than 20 chars']
    },
    socialLinks: {
        website: {
            type: String,
            maxLength: [100, 'Website  must be less than 100 characters']
        },
        facebook: {
            type: String,
            maxLength: [100, 'Facebook address must be less than 100 characters']
        },
        instagram: {
            type: String,
            maxLength: [100, 'Instagram address must be less than 100 characters']
        },
        youtube: {
            type: String,
            maxLength: [100, 'Youtube address must be less than 100 characters']
        },
        x: {
            type: String,
            maxLength: [100, 'X address must be less than 100 characters']
        },
        linkedin: {
            type: String,
            maxLength: [100, 'LinkedIn address must be less than 100 characters']
        }
    },
    twoFactorSecret: {
        type: String
    },
    twoFactorEnabled: {
        type: Boolean
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })

UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    
    // Entferne sensitive Felder für JSON Responses
    delete user.password;
    delete user.__v; // Mongoose interne Version
    delete user.updatedAt; // Optional, wenn nicht benötigt
    
    // Optional: _id → id umbenennen
    user.id = user._id;
    delete user._id;
    
    return user;
};


UserSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();       //MONGOOSE: return zuerst! sonst wird await ausgeführt

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

export default model<IUser>('User', UserSchema)
