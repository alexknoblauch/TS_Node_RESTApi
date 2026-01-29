router.get('/test-access-token', (req: Request, res: Response) => {
    const { generateAccessToken } = require('@/lib/jwt');
    const testUserId = new Types.ObjectId("68fc99a87d698c809cd599bd");
    const accessToken = generateAccessToken(testUserId);
    
    console.log('🔐 Generated Access Token:', accessToken); // Prüfe ob er mit eyJ beginnt
    
    res.json({ 
        accessToken: accessToken,
        instructions: 'Use in Authorization header as: Bearer ' + accessToken
    });
});

