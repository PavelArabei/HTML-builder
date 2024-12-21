const { join } = require('node:path');
const {
  createDirectory,
  removeDirectory,
  mergeStyles,
  findAndReplaceTags,
  deepCopy,
} = require('../utils/utils');

const directoryPath = join(__dirname, 'project-dist');

const htmlSourcePath = join(__dirname, 'components');
const htmlTemplatePath = join(__dirname, 'template.html');
const htmlDestinationPath = join(directoryPath, 'index.html');

const stylesBundlePath = join(directoryPath, 'style.css');
const stylesPath = join(__dirname, 'styles');

const sourseAssetsPath = join(__dirname, 'assets');
const destinationAssetsPath = join(directoryPath, 'assets');

async function start() {
  await removeDirectory(directoryPath);
  await createDirectory(directoryPath);

  await findAndReplaceTags(
    htmlSourcePath,
    htmlTemplatePath,
    htmlDestinationPath,
  );
  await mergeStyles(stylesPath, stylesBundlePath);
  await deepCopy(sourseAssetsPath, destinationAssetsPath);
}
start();
