const { createReadStream } = require('node:fs');
const { join } = require('node:path');

const filePath = join(__dirname, 'text.txt');
const steam = createReadStream(filePath, 'utf-8');

let streamData = '';
steam.on('data', (chunk) => (streamData += chunk));
steam.on('end', () => console.log(streamData));
