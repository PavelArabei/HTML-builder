const { join } = require('node:path');
const { mergeStyles } = require('../utils/utils');

const filePath = join(__dirname, 'project-dist', 'bundle.css');
const stylesPath = join(__dirname, 'styles');

mergeStyles(stylesPath, filePath);
