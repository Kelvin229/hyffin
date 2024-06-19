const { bucket, db } = require('../../firebaseAdmin');
const fs = require('fs-extra');
const path = require('path');

exports.saveImage = async (userId, uploadId, tempPath, update = false) => {
  const destination = `uploads/${userId}/${uploadId}.jpg`;

  if (update) {
    const file = bucket.file(destination);
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error('Image not found for updating');
    }
  }

  await bucket.upload(tempPath, {
    destination,
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: uploadId,
      },
    },
  });

  const imagePath = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media&token=${uploadId}`;
  await db.ref(`users/${userId}/images/${uploadId}`).set({
    imagePath,
    lastModified: Date.now(),
  });

  await fs.remove(tempPath);

  return imagePath;
};

exports.getImage = async (userId, uploadId, clientLastModified) => {
  const snapshot = await db.ref(`users/${userId}/images/${uploadId}`).once('value');
  const imageData = snapshot.val();
  if (!imageData) {
    throw new Error('Image not found');
  }

  const lastModified = imageData.lastModified;

  if (clientLastModified && new Date(clientLastModified).getTime() >= lastModified) {
    return { imagePath: null, lastModified };
  }

  return {
    imagePath: imageData.imagePath,
    lastModified,
  };
};

exports.getAllImages = async (userId) => {
  const snapshot = await db.ref(`users/${userId}/images`).once('value');
  const images = snapshot.val();
  if (!images) {
    return [];
  }
  return Object.entries(images).map(([uploadId, data]) => ({
    uploadId,
    uri: data.imagePath,
  }));
};

exports.deleteImage = async (userId, uploadId) => {
  const destination = `uploads/${userId}/${uploadId}.jpg`;
  const file = bucket.file(destination);

  try {
    await file.delete();
    await db.ref(`users/${userId}/images/${uploadId}`).remove();
    return true;
  } catch (error) {
    throw new Error('Failed to delete image');
  }
};

exports.deleteAllImages = async (userId) => {
  const snapshot = await db.ref(`users/${userId}/images`).once('value');
  const images = snapshot.val();
  if (!images) {
    return;
  }

  for (const uploadId in images) {
    const destination = `uploads/${userId}/${uploadId}.jpg`;
    const file = bucket.file(destination);
    await file.delete();
  }

  await db.ref(`users/${userId}/images`).remove();
};
