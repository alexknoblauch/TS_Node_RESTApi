/**
 *  Node Modules
 */
import mongoose, {Schema, model, Document} from 'mongoose'
import crypto from 'crypto'

/**
 *  Custom Modules
 */
import bcrypt from 'bcrypt'
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';


export interface UserBase {
  userName: string;
  email: string;
  password: string;
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
  twoFactorSecret: string;
  twoFactorEnabled: boolean;
  refreshToken: string;
  passwordResetToken: string;
  passwordResetTokenExpires: Date | null;
}

export interface UserLean {
    _id: string;  
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
    refreshToken: string,
    passwordResetToken: string,
    passwordResetTokenExpires: Date | null
}


export type UserDocument = HydratedDocument<UserBase & {        //HydratedDocument: inkludiert mongoose funtkionen save() toObject() ect
  createResetPasswordToken(): string;
}>;


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

export interface LoginInput {
    email: string;
    password: string;
}

export interface LogoutInput {
    userId: string;
    refreshToken: string;
}

export interface RefreshtokenInput {
    refreshToken: string,
    userId: string
}

export interface RefreshTokenResult {
  accessToken: string
}

export interface UserCreateInput {
    userName: string,
    email: string, 
    password: string, 
    role: 'user' | 'admin'
}


const UserSchema = new Schema<UserDocument>({
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
    },
    passwordResetToken: {
        type: String
    }
}, { timestamps: true })

UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    
    delete user.password;
    delete user.__v; // Mongoose interne Version
    delete user.updatedAt; // Optional, wenn nicht benötigt
    delete user.refreshToken;
    delete user.passwordResetToken;
    delete user.passwordResetTokenExpires;
    user.id = user._id;
    delete user._id;
    
    return user;
};


UserSchema.pre('save', async function(this: UserDocument, next: any){       // this arbeitet auf instanz ebene 
    if (!this.isModified('password')) return next();     

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.createResetPasswordToken = function(): string {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken)
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

export default model<UserDocument>('User', UserSchema)



UserSchema.methods.createResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex')
    const encryptedToken = crypto.createHash('sha256').update(resetToken).digest('hex') // hash ist Obj digest macht string

    this.passwordResetToken = encryptedToken
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}