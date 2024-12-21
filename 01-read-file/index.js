const { createReadStream } = require('node:fs');
const { join } = require('node:path');

const filePath = join(__dirname, 'text.txt');
const stream = createReadStream(filePath, 'utf-8');

let streamData = '';
stream.on('data', (chunk) => (streamData += chunk));
stream.on('end', () => console.log(streamData));
