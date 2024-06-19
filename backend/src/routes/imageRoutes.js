// src/routes/imageRoutes.js
const express = require('express');
const upload = require('../middleware/upload');
const imageController = require('../controllers/imageController');
const router = express.Router();
const authenticateToken = require('../middleware/authenticate');

router.post('/user/:userId/images/uploadImage/:uploadId', authenticateToken, upload.single('image'), imageController.uploadImage);
router.put('/user/:userId/images/updateImage/:uploadId', authenticateToken, upload.single('image'), imageController.updateImage);
router.get('/user/:userId/images/downloadImage/:uploadId', authenticateToken, imageController.downloadImage);
router.delete('/user/:userId/images/deleteImage/:uploadId', authenticateToken, imageController.deleteImage);
router.get('/user/:userId/images/allImages', authenticateToken, imageController.getAllImages);
router.delete('/user/:userId/images/deleteAllImages', authenticateToken, imageController.deleteAllImages);

module.exports = router;
