const { join } = require('node:path');
const {
  deepCopy,
  removeDirectory,
  createDirectory,
} = require('../utils/utils');

const sourcePath = join(__dirname, 'files');
const destinationPath = join(__dirname, 'files-copy');

async function start() {
  await removeDirectory(destinationPath);
  await createDirectory(destinationPath);
  await deepCopy(sourcePath, destinationPath);
}

start();
