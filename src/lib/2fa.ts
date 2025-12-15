/**
 * Node Modules
 */
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import { Request, Response } from 'express';
import bcrypt from 'bcrypt'


/**
 * Models
 */
import User from '@/models/user';


export const setup2FA = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        
        const secret = speakeasy.generateSecret({
            length: 20 
        });
        
        // 2. QR Code generieren
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);
        
        // 3. Secret vorläufig in DB speichern
        await User.findByIdAndUpdate(userId, {
            temp2FASecret: secret.base32, 
            is2FAEnabled: false
        });
        
        res.json({
            success: true,
            qrCode: qrCodeUrl,
            secret: secret.base32, 
            manualEntryCode: secret.otpauth_url
        });
        
    } catch (error) {
        console.error('2FA Setup error:', error);
        res.status(500).json({
            success: false,
            message: 'Fehler beim 2FA Setup'
        });
    }
};



export const disable2FA = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { password } = req.body; 
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User nicht gefunden'
            });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Falsches Passwort'
            });
        }
        
        // 3. 2FA deaktivieren
        await User.findByIdAndUpdate(userId, {
            twoFASecret: null,
            temp2FASecret: null,
            is2FAEnabled: false,
            backupCodes: []
        });
        
        res.json({
            success: true,
            message: '2FA erfolgreich deaktiviert'
        });
        
    } catch (error) {
        console.error('2FA Disable error:', error);
        res.status(500).json({
            success: false,
            message: 'Fehler beim Deaktivieren von 2FA'
        });
    }
};