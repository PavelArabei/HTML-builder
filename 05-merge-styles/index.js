const { join, extname } = require('node:path');
const { createWriteStream, createReadStream } = require('node:fs');
const { readDirectory, removeDirectory } = require('../utils/utils');

const filePath = join(__dirname, 'project-dist', 'bundle.css');
const stylesPath = join(__dirname, 'styles');

async function start() {
  await removeDirectory(filePath);
  const fileNames = await readDirectory(stylesPath);
  if (!fileNames) return;

  const writeStream = createWriteStream(filePath, { flags: 'a' });

  for await (const fileName of fileNames) {
    const fileException = extname(fileName);
    if (fileException !== '.css') continue;

    const filePath = join(stylesPath, fileName);
    const stream = createReadStream(filePath);
    stream.pipe(writeStream);
  }
}

start();
