// src/utils/fileUtils.js
const fs = require('fs-extra');
const path = require('path');

exports.moveFile = async (source, destination) => {
  await fs.move(source, destination, { overwrite: true });
};
