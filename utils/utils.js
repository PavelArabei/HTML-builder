const { mkdir, readdir, stat, rm, copyFile } = require('node:fs/promises');
const { join } = require('node:path');

const createDirectory = async (path) => {
  try {
    await mkdir(path, { recursive: true });
  } catch (error) {
    console.error('Error creating directory', error);
  }
};

const removeDirectory = async (path) => {
  try {
    await rm(path, { force: true, recursive: true });
  } catch (error) {
    console.error('Error removing directory', error);
  }
};

const readDirectory = async (path) => {
  try {
    return await readdir(path);
  } catch (error) {
    console.error('Error reading directory', error);
  }
};

const copyF = async (sourcePath, destinationPath) => {
  try {
    await copyFile(sourcePath, destinationPath);
  } catch (error) {
    console.error('Error copying file', error);
  }
};

const getStats = async (path) => {
  try {
    return await stat(path);
  } catch (error) {
    console.error('Error getting stats', error);
  }
};

const deepCopy = async (sourcePath, destinationPath) => {
  const fileNames = await readDirectory(sourcePath);
  if (!fileNames) return;

  for (const fileName of fileNames) {
    const filePath = join(sourcePath, fileName);
    const stats = await getStats(filePath);
    const destination = join(destinationPath, fileName);

    if (stats.isFile()) {
      await copyF(filePath, destination);
    } else {
      await createDirectory(destination);
      await deepCopy(filePath, destination);
    }
  }
};

module.exports = {
  createDirectory,
  readDirectory,
  getStats,
  deepCopy,
  removeDirectory,
};
