// src/middleware/authenticate.js
const admin = require('firebase-admin');

module.exports = async (req, res, next) => {
    // In your middleware or right in the controller where you check the token:
    console.log(req.headers.authorization);

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication failed: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: Invalid token format' });
  }
    // In authenticateToken middleware
    console.log('Authenticating token:', req.headers.authorization);
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log('Token valid for user:', decodedToken.uid);
        req.userId = decodedToken.uid;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Authentication failed: Invalid token' });
    }
};
