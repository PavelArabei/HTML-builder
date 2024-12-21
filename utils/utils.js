const { mkdir, readdir, stat } = require('node:fs/promises');

const createDirectory = async (path) => {
  try {
    await mkdir(path, { recursive: true });
  } catch (error) {
    console.error('Error creating directory', error);
  }
};

const readDirectory = async (path) => {
  try {
    return await readdir(path);
  } catch (error) {
    console.error('Error reading directory', error);
  }
};

const getStats = async (path) => {
  try {
    return await stat(path);
  } catch (error) {
    console.error('Error getting stats', error);
  }
};

module.exports = { createDirectory, readDirectory, getStats };
