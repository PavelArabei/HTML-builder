const {
  readFile,
  mkdir,
  readdir,
  stat,
  rm,
  copyFile,
} = require('node:fs/promises');
const { join, extname, basename } = require('node:path');
const { createWriteStream, createReadStream } = require('node:fs');

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

const readF = async (path) => {
  try {
    return await readFile(path, 'utf-8');
  } catch (error) {
    console.error('Error reading file', error);
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

async function isFileWithExtension(filePath, fileName, extension) {
  const stats = await getStats(filePath);
  const fileException = extname(fileName);
  return stats.isFile() && fileException === extension;
}

async function mergeStyles(sourcePath, destinationPath) {
  await removeDirectory(destinationPath);
  const fileNames = await readDirectory(sourcePath);
  if (!fileNames) return;

  const writeStream = createWriteStream(destinationPath, { flags: 'a' });
  const writePromises = [];
  for await (const fileName of fileNames) {
    const filePath = join(sourcePath, fileName);
    const isFileExc = await isFileWithExtension(filePath, fileName, '.css');
    if (!isFileExc) continue;
    const stream = createReadStream(filePath);
    const writePromise = new Promise((resolve, reject) => {
      stream
        .on('error', reject)
        .on('end', resolve)
        .pipe(writeStream, { end: false });
    });
    writePromises.push(writePromise);

    stream.pipe(writeStream, { end: false });
  }

  await Promise.all(writePromises);
  writeStream.end();
}

async function findAndReplaceTags(
  htmlSourcePath,
  htmlTemplatePath,
  htmlDestinationPath,
) {
  let template = await readF(htmlTemplatePath);
  if (!template) return;

  const fileNames = await readDirectory(htmlSourcePath);
  if (!fileNames) return;

  for await (const fileName of fileNames) {
    const filePath = join(htmlSourcePath, fileName);
    const isFileExc = await isFileWithExtension(filePath, fileName, '.html');
    if (!isFileExc) continue;
    const tagName = basename(fileName, extname(fileName));
    const content = await readF(filePath);
    template = template.replace(`{{${tagName}}}`, content);
  }

  const writableStream = createWriteStream(htmlDestinationPath, { flags: 'a' });
  writableStream.write(template);
}

module.exports = {
  createDirectory,
  readDirectory,
  getStats,
  deepCopy,
  removeDirectory,
  mergeStyles,
  readF,
  findAndReplaceTags,
};
