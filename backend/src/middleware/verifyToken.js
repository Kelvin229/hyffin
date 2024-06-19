// src/middleware/verifyToken.js
const admin = require('firebase-admin');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Authentication failed: No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.userId = decodedToken.uid;
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Authentication failed: Invalid token' });
  }
};
