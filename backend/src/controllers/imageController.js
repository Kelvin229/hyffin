const imageService = require('../services/imageService');

exports.uploadImage = async (req, res) => {
  const { uploadId, userId } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const { path: tempPath } = file;
  try {
    const imagePath = await imageService.saveImage(userId, uploadId, tempPath);
    res.status(201).json({ message: 'Image uploaded successfully', imagePath });
  } catch (error) {
    console.error('Error uploading image:', error.message);
    return res.status(500).json({ error: 'Error uploading image' });
  }
};

exports.updateImage = async (req, res) => {
  const { uploadId, userId } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const { path: tempPath } = file;
  try {
    const imagePath = await imageService.saveImage(userId, uploadId, tempPath, true);
    res.status(200).json({ message: 'Image updated successfully', imagePath });
  } catch (error) {
    console.error('Error updating image:', error.message);
    return res.status(500).json({ error: 'Error updating image' });
  }
};

exports.downloadImage = async (req, res) => {
  const { uploadId, userId } = req.params;
  const clientLastModified = req.headers['if-modified-since'];

  try {
    const { imagePath, lastModified } = await imageService.getImage(userId, uploadId, clientLastModified);
    if (!imagePath) return res.status(304).send();
    res.set('Last-Modified', new Date(lastModified).toUTCString());
    res.status(200).json({ imagePath });
  } catch (error) {
    console.error('Error downloading image:', error.message);
    return res.status(404).json({ error: 'Image not found' });
  }
};

exports.getAllImages = async (req, res) => {
  console.log("Received request to get all images for user:", req.params.userId);
  try {
    const images = await imageService.getAllImages(req.params.userId);
    console.log('Sending images:', images);
    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};


exports.deleteImage = async (req, res) => {
  const { uploadId, userId } = req.params;

  try {
    await imageService.deleteImage(userId, uploadId);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error.message);
    return res.status(500).json({ error: 'Error deleting image' });
  }
};

exports.deleteAllImages = async (req, res) => {
  const { userId } = req.params;
  try {
    await imageService.deleteAllImages(userId);
    res.status(200).json({ message: 'All images deleted successfully' });
  } catch (error) {
    console.error('Error deleting all images:', error.message);
    return res.status(500).json({ error: 'Error deleting all images' });
  }
};
