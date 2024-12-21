const { join, basename, extname } = require('node:path');
const { readDirectory, getStats } = require('../utils/utils');

const folderPath = join(__dirname, 'secret-folder');

async function start() {
  const fileNames = await readDirectory(folderPath);
  if (!fileNames) return;

  for (const fileName of fileNames) {
    const filePath = join(folderPath, fileName);
    const stats = await getStats(filePath);
    if (!stats.isFile()) continue;

    const fileBase = basename(fileName, extname(fileName));
    const fileException = extname(fileName).slice(1);
    const fileSize = (stats.size / 1024).toFixed(3);

    console.log(`${fileBase} - ${fileException} - ${fileSize}kb`);
  }
}

start();
